const User = require('../../models/user')


const userController = () => {
    return{
        async getUsers(req,res){
            const allUsers = await User.find()
            res.json({ allUsers:allUsers })
        },
        async saveUsers(req,res){
            //console.log(req.body)
            // Set up IPFS
            //const ipfs = await IPFS.create();
            const { userName,email,age,gender,cadd,status,photo } = req.body
            // const photo = req.file
            // console.log(photo)
    
            // Read the photo file and convert it to a buffer
            // const photoBuffer = fs.readFileSync(photo)
    
            // Store photo on IPFS
            // const gateway = 'https://ipfs.io/ipfs/'
            // const photoResult = await ipfs.add(photo.buffer)
            // const photoIpfsUrl = gateway+photoResult.cid.toString()
    
            //using pinata
            // Upload photo to Pinata using API key
            // const apiKey = '4dec1b6b854aac1626cf';
            // const apiSecret = '9d98be55c6dcc2d2e0be3a1ce46ad2954ad80c3cc611ba64efc7bb68acfc90aa';
            // const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
            // const photoBuffer = photo.buffer
    
            //try {
                //try1
                // const response = await axios.post(pinataEndpoint, photoBuffer, {
                //     headers: {
                //         pinata_api_key: apiKey,
                //         pinata_secret_api_key: apiSecret,
                //     },
                // });
                // console.log(response.data.IpfsHash)
    
                //try2
                // const resFile = await axios({
                //     method: "post",
                //     url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                //     data: photo.buffer,
                //     headers: {
                //       pinata_api_key: apiKey,
                //       pinata_secret_api_key: apiSecret,
                //       "Content-Type": "multipart/form-data",
                //     },
                // })
    
    
                //try3
                // Create a new FormData instance
            //     const formData = new FormData();
            //     formData.append('photo', req.file.buffer); // 'file' should match the field name expected by the API
    
            //     const resFile = await axios.post(pinataEndpoint, formData, {
            //         headers: {
            //             ...formData.getHeaders(), // Set headers for the FormData instance
            //             pinata_api_key: apiKey,
            //             pinata_secret_api_key: apiSecret,
            //         },
            //     });
    
            //     console.log(resFile.data.IpfsHash)
    
            // } catch (error) {
            //     console.log(error)
            // }
    
            // const ipfsHash = response.data.IpfsHash
    
            // console.log(photoResult)
            // console.log(photoIpfsUrl)
            
            try {
                //Validate request
            if(!userName || !email || !age || !gender || !cadd){
                return res.status(400).json({ error:"Pls provide all required feilds.." })
            }
    
            //check if user already exists
            const existingUser = await User.findOne({ cadd:cadd })
            if(existingUser){
                return res.status(409).json({ error: 'User already exists' });
            }
    
            let user = null;
            if(photo && status){
                user = new User({
                    userName,
                    age,
                    gender,
                    status,
                    email,
                    cadd,
                    photo
                })
            }
            else if(photo && !status){
                user = new User({
                    userName,
                    age,
                    gender,
                    email,
                    cadd,
                    photo
                })
            }
            else if(!photo && status){
                user = new User({
                    userName,
                    age,
                    gender,
                    status,
                    email,
                    cadd
                })
            }
            else{
                user = new User({
                    userName,
                    age,
                    gender,
                    email,
                    cadd
                })
            }
    
            //console.log(user)
            // return res.status(201).json({ msg:"User Registered Successfully..."})
    
            user.save().then(user =>{
                return res.status(201).json({ msg:"User Registered Successfully..."})
            }).catch(err =>{
                return res.status(404).json({ error:"Some error occured..."})
            })            
            } catch (error) {
                //console.log(error);
                return res.json({ msg:"Error occured"})
            }
        },
        async login(req, res){
            const { userName, cadd } = req.body
    
            if (!userName || !cadd) {
                return res.status(400).json({ msg: "Pls provide all the feilds.." })
            }
    
            const user = await User.findOne({ cadd: cadd })
    
            if (user.userName === userName) {
                return res.status(201).json({ msg: "User Logged in successfully..", data:user })
            }
            return res.json({ error: "UserName not registered.." })
        }
    }
}

module.exports = userController