#!/bin/bash

# Coffee Dates ML Service Startup Script
# This script sets up and runs the complete ML-powered matchmaking system

set -e

echo "🚀 Starting Coffee Dates ML Service..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are available"
}

# Check if required files exist
check_files() {
    required_files=(
        "docker-compose.ml.yml"
        "ml-service/Dockerfile"
        "ml-service/requirements.txt"
        "ml-service/api/main.py"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            print_error "Required file not found: $file"
            exit 1
        fi
    done
    
    print_status "All required files are present"
}

# Generate sample data
generate_data() {
    print_header "Generating sample data..."
    
    cd ml-service
    
    # Install Python dependencies for data generation
    if [[ ! -d "venv" ]]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    pip install -q faker pandas numpy
    
    # Generate sample data
    python3 -c "
from data.sample_generator import SampleDataGenerator
import os

generator = SampleDataGenerator()
data = generator.generate_complete_dataset(
    num_users=1000,
    num_interactions=5000,
    num_feedback=500
)

os.makedirs('sample_data', exist_ok=True)
generator.save_to_json(data, 'sample_data')
print('Sample data generated successfully!')
"
    
    deactivate
    cd ..
    
    print_status "Sample data generated in ml-service/sample_data/"
}

# Start services
start_services() {
    print_header "Starting ML services with Docker Compose..."
    
    # Stop any existing services
    docker-compose -f docker-compose.ml.yml down 2>/dev/null || true
    
    # Start services
    docker-compose -f docker-compose.ml.yml up -d
    
    print_status "Services are starting up..."
    
    # Wait for services to be healthy
    print_status "Waiting for services to be ready..."
    
    # Wait for MongoDB
    echo -n "Waiting for MongoDB"
    for i in {1..30}; do
        if docker-compose -f docker-compose.ml.yml exec -T mongo mongosh --eval "db.runCommand('ping')" &>/dev/null; then
            echo ""
            print_status "MongoDB is ready"
            break
        fi
        echo -n "."
        sleep 2
    done
    
    # Wait for ML API
    echo -n "Waiting for ML API"
    for i in {1..30}; do
        if curl -s http://localhost:8000/health &>/dev/null; then
            echo ""
            print_status "ML API is ready"
            break
        fi
        echo -n "."
        sleep 2
    done
}

# Load sample data
load_data() {
    print_header "Loading sample data into database..."
    
    # Run data loader
    docker-compose -f docker-compose.ml.yml run --rm data-loader
    
    print_status "Sample data loaded successfully"
}

# Test the service
test_service() {
    print_header "Testing ML service..."
    
    # Test health endpoint
    health_response=$(curl -s http://localhost:8000/health)
    if echo "$health_response" | grep -q '"status":"healthy"'; then
        print_status "Health check passed"
    else
        print_warning "Health check returned: $health_response"
    fi
    
    # Test stats endpoint
    stats_response=$(curl -s http://localhost:8000/stats)
    if echo "$stats_response" | grep -q '"total_users"'; then
        print_status "Stats endpoint working"
        echo "$stats_response" | python3 -m json.tool 2>/dev/null | head -10
    else
        print_warning "Stats endpoint returned: $stats_response"
    fi
    
    # Test recommendations (if we have users)
    echo ""
    print_status "Testing recommendations endpoint..."
    rec_response=$(curl -s -X POST http://localhost:8000/recommendations \
        -H "Content-Type: application/json" \
        -d '{"user_id": "user_0001", "top_k": 3}')
    
    if echo "$rec_response" | grep -q '"user_id"'; then
        print_status "Recommendations endpoint working"
        echo "Sample recommendation:"
        echo "$rec_response" | python3 -m json.tool 2>/dev/null | head -15
    else
        print_warning "Recommendations returned: $rec_response"
    fi
}

# Show service status
show_status() {
    print_header "Service Status"
    
    echo ""
    print_status "Running containers:"
    docker-compose -f docker-compose.ml.yml ps
    
    echo ""
    print_status "Service URLs:"
    echo "  🤖 ML API:       http://localhost:8000"
    echo "  📊 Health Check: http://localhost:8000/health"
    echo "  📈 API Docs:     http://localhost:8000/docs"
    echo "  🗄️  MongoDB:      localhost:27017"
    echo "  🔄 Redis:        localhost:6379"
    
    echo ""
    print_status "Sample API calls:"
    echo "  curl http://localhost:8000/health"
    echo "  curl http://localhost:8000/stats"
    echo "  curl -X POST http://localhost:8000/recommendations \\"
    echo "    -H 'Content-Type: application/json' \\"
    echo "    -d '{\"user_id\": \"user_0001\", \"top_k\": 5}'"
    
    echo ""
    print_status "To view logs:"
    echo "  docker-compose -f docker-compose.ml.yml logs -f ml-api"
    
    echo ""
    print_status "To stop services:"
    echo "  docker-compose -f docker-compose.ml.yml down"
}

# Main execution
main() {
    echo "☕ Coffee Dates ML Service Setup"
    echo "================================"
    echo ""
    
    # Parse command line arguments
    case "${1:-start}" in
        "start")
            check_docker
            check_files
            generate_data
            start_services
            load_data
            test_service
            show_status
            ;;
        "stop")
            print_header "Stopping services..."
            docker-compose -f docker-compose.ml.yml down
            print_status "Services stopped"
            ;;
        "restart")
            print_header "Restarting services..."
            docker-compose -f docker-compose.ml.yml restart
            print_status "Services restarted"
            ;;
        "logs")
            docker-compose -f docker-compose.ml.yml logs -f "${2:-ml-api}"
            ;;
        "status")
            show_status
            ;;
        "test")
            test_service
            ;;
        *)
            echo "Usage: $0 {start|stop|restart|logs|status|test}"
            echo ""
            echo "Commands:"
            echo "  start   - Start all ML services (default)"
            echo "  stop    - Stop all services"
            echo "  restart - Restart all services"
            echo "  logs    - Show service logs"
            echo "  status  - Show service status"
            echo "  test    - Test service endpoints"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"