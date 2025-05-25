import { Link } from "react-router-dom";

import { Youtube, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Logo from "../assets/Links.png";

function Footer() {
  return (
    <div class="w-full bg-white px-2 pb-5 text-black lg:px-40">
      <div class="flex flex-col content-center justify-between px-[50px] sm:flex-row">
        <div class="my-2 flex flex-col items-start md:items-center lg:my-10">
          <img src={Logo} alt="Weeb logo" class="my-5" />
        </div>

        <div class="my-2 flex flex-col items-start text-base font-normal md:items-center lg:my-10">
          <h2 class="text-blue-gray my-5 font-medium">PRODUCT</h2>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Pricing
          </Link>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Overview
          </Link>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Browse
          </Link>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Accessibility
          </Link>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Five
          </Link>
        </div>
        <div class="my-2 flex flex-col items-start text-base font-normal md:items-center lg:my-10">
          <h2 class="text-blue-gray my-5 font-medium">SOLUTIONS</h2>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Brainstorming
          </Link>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Ideation
          </Link>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Wireframing
          </Link>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Research
          </Link>
        </div>
        <div class="my-2 flex flex-col items-start text-base font-normal md:items-center lg:my-10">
          <h2 class="text-blue-gray my-5 font-medium">RESSOURCES</h2>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Help Center
          </Link>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Blog
          </Link>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Tutorials
          </Link>
        </div>
        <div class="my-2 flex flex-col items-start text-base font-normal md:items-center lg:my-10">
          <h2 class="text-blue-gray my-5 font-medium">COMPANY</h2>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            About
          </Link>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Press
          </Link>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Events
          </Link>
          <Link class="focus:outline-main-text my-3 rounded p-2 focus:outline-2 focus:outline-offset-2">
            Careers
          </Link>
        </div>
      </div>

      <div class="border-footer-border mt-2 flex flex-col items-center border-t py-15 md:flex-row md:justify-between">
        <h2 class="">@ 2025 Weeb, Inc. All rights reserved.</h2>
        <div class="my-5 flex flex-row px-1 lg:my-0">
          <Youtube size={24} class="mx-1 lg:mx-2" />
          <Facebook size={24} class="mx-1 lg:mx-2" />
          <Twitter size={24} class="mx-1 lg:mx-2" />
          <Instagram size={24} class="mx-1 lg:mx-2" />
          <Linkedin size={24} class="mx-1 lg:mx-2" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
