import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="/home" className="flex items-center">
              <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 me-3" alt="FlowBite Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Smart-Task</span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            {[
              { title: "Resources", links: [
                { name: "Flowbite", url: "https://flowbite.com/" },
                { name: "Tailwind CSS", url: "https://tailwindcss.com/" }
              ]},
              { title: "Follow us", links: [
                { name: "Github", url: "https://github.com/themesberg/flowbite" },
                { name: "Discord", url: "https://discord.gg/4eeurUVvTy" }
              ]},
              { title: "Legal", links: [
                { name: "Privacy Policy", url: "#" },
                { name: "Terms & Conditions", url: "#" }
              ]}
            ].map((section, index) => (
              <div key={index}>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">{section.title}</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  {section.links.map((link, i) => (
                    <li key={i} className="mb-4">
                      <a href={link.url} className="hover:underline">{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024 <a href="/home" className="hover:underline">Smart-Task™</a>. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            {["Facebook", "Discord", "Twitter", "GitHub"].map((social, i) => (
              <a key={i} href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                <span className="sr-only">{social} page</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
