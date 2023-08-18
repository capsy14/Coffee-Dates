export default () => {
  const Footer = [
    {
      href: "javascript:void()",
      name: "About",
    },
    {
      href: "javascript:void()",
      name: "Blog",
    },
    {
      href: "javascript:void()",
      name: "",
    },
    {
      href: "javascript:void()",
      name: "Team",
    },
    {
      href: "javascript:void()",
      name: "Careers",
    },

    {
      href: "javascript:void()",
      name: "Support",
    },
  ];

  return (
    <footer
      className="text-gray-500 bg-white px-4 py-5 md:py-7 mx-auto md:px-0"
      id="footer"
      style={{ width: "100%" }}
    >
      <div className="max-w-lg sm:mx-auto sm:text-center">
        {/* <img
          src="https://www.floatui.com/logo.svg"
          className="w-32 sm:mx-auto"
        /> */}

        <p className="leading-relaxed mt-2 text-[15px]">
          Discover your perfect coffee companion through our unique matchmaking
          experience. Sip, connect, and create memorable moments together.
        </p>
      </div>
      <ul className="items-center justify-center mt-8 space-y-5 sm:flex sm:space-x-4 sm:space-y-0">
        {Footer.map((item, idx) => (
          <li className="hover:text-gray-800" key={idx}>
            <a href={item.href}>{item.name}</a>
          </li>
        ))}
      </ul>
      <div className="mt-8 items-center justify-between sm:flex">
        <div className="mt-4 sm:mt-0">
          &copy; 2022 Coffee ka Chakkar All rights reserved.
        </div>
        <div className="mt-6 sm:mt-0">
          <ul className="flex items-center space-x-4">{/* SVG icon list */}</ul>
        </div>
      </div>
      <style jsx>{`
        .svg-icon path,
        .svg-icon polygon,
        .svg-icon rect {
          fill: currentColor;
        }
      `}</style>
    </footer>
  );
};
