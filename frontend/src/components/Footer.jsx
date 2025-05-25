import { Link } from "react-router-dom";

import { Youtube, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Logo from "../assets/Links.png";

function Footer() {
  return (
    <div className="w-full bg-white px-2 pb-5 text-black lg:px-40">
      <div className="flex flex-col content-center justify-between px-[50px] sm:flex-row">
        <div className="my-2 flex flex-col items-start md:items-center lg:my-10">
          <img src={Logo} alt="Weeb logo" className="my-5" />
        </div>

        <div className="my-2 flex flex-col items-start text-base font-normal md:items-center lg:my-10">
          <h2 className="text-blue-gray my-5 font-medium">PRODUCT</h2>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Pricing
          </Link>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Overview
          </Link>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Browse
          </Link>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Accessibility
          </Link>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Five
          </Link>
        </div>
        <div className="my-2 flex flex-col items-start text-base font-normal md:items-center lg:my-10">
          <h2 className="text-blue-gray my-5 font-medium">SOLUTIONS</h2>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Brainstorming
          </Link>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Ideation
          </Link>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Wireframing
          </Link>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Research
          </Link>
        </div>
        <div className="my-2 flex flex-col items-start text-base font-normal md:items-center lg:my-10">
          <h2 className="text-blue-gray my-5 font-medium">RESSOURCES</h2>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Help Center
          </Link>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Blog
          </Link>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Tutorials
          </Link>
        </div>
        <div className="my-2 flex flex-col items-start text-base font-normal md:items-center lg:my-10">
          <h2 className="text-blue-gray my-5 font-medium">COMPANY</h2>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            About
          </Link>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Press
          </Link>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Events
          </Link>
          <Link className="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Careers
          </Link>
        </div>
      </div>

      <div className="border-footer-border mt-2 flex flex-col items-center justify-center border-t py-15 md:flex-row md:justify-between">
        <h2 className="">@ 2025 Weeb, Inc. All rights reserved.</h2>
        <div className="my-5 flex flex-row px-1 lg:my-0">
          <Youtube size={24} className="mx-1 lg:mx-2" />
          <Facebook size={24} className="mx-1 lg:mx-2" />
          <Twitter size={24} className="mx-1 lg:mx-2" />
          <Instagram size={24} className="mx-1 lg:mx-2" />
          <Linkedin size={24} className="mx-1 lg:mx-2" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
