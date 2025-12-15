import React from "react";
import logo from "../assets/SkillMatchr_logo.png"; // adjust path if needed

export const Footer = () => {
  return (
    <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl text-center">

        {/* Logo */}
        <a
          href="#"
          className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            src={logo}
            alt="SkillMatchr Logo"
            className="w-40 h-auto object-contain drop-shadow-md"
          />
        </a>

        {/* Description */}
        <p className="my-6 text-gray-500 dark:text-gray-400">
          Open-source library of over 400+ web components and interactive elements built for better web.
        </p>

        {/* Links */}
        <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
          {[ "Blog", "About Us", "FAQs", "Contact"].map(
            (item) => (
              <li key={item}>
                <a href="" className="mr-4 hover:underline md:mr-6">
                  {item}
                </a>
               
              </li>
            )
          )}
        </ul>

        {/* Copyright */}
        <span className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} SkillMatchr™. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
