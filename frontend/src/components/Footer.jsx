import { Link } from "react-router-dom";

import { Youtube, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Logo from "../assets/Links.png";


function Footer() {
  return (
    <div class="bg-white text-black px-2 lg:px-40 pb-5">
      <div class="flex flex-col lg:flex-row  justify-between content-center px-[50px]">
        <div class="my-2 lg:my-10 flex flex-col justify-content items-center">
          <img src={Logo} alt="Weeb logo" class="my-5"/>
        </div>

        <div class="flex flex-col text-base font-normal my-2 lg:my-10">
          <h2 class="font-medium text-blue-gray my-5">PRODUCT</h2>
          <Link class="my-3">Pricing</Link>
          <Link class="my-3">Overview</Link>
          <Link class="my-3">Browse</Link>
          <Link class="my-3">Accessibility</Link>
          <Link class="my-3">Five</Link>
        </div>
        <div class="flex flex-col text-base font-normal my-2 lg:my-10">
          <h2 class="font-medium text-blue-gray my-5">SOLUTIONS</h2>
          <Link class="my-3">Brainstorming</Link>
          <Link class="my-3">Ideation</Link>
          <Link class="my-3">Wireframing</Link>
          <Link class="my-3">Research</Link>
        </div>
        <div class="flex flex-col text-base font-normal my-2 lg:my-10">
          <h2 class="font-medium text-blue-gray my-5">RESSOURCES</h2>
          <Link class="my-3">Help Center</Link>
          <Link class="my-3">Blog</Link>
          <Link class="my-3">Tutorials</Link>
        </div>
        <div class="flex flex-col text-base font-normal my-2 lg:my-10">
          <h2 class="font-medium text-blue-gray my-5">COMPANY</h2>
          <Link class="my-3">About</Link>
          <Link class="my-3">Press</Link>
          <Link class="my-3">Events</Link>
          <Link class="my-3">Careers</Link>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row lg:justify-between items-center border-t py-15 mt-2">
        <h2 class="">@ 2025 Weeb, Inc. All rights reserved.</h2>
        <div class="flex flex-row my-5 lg:my-0 px-1">
          <Youtube size={24}  class=" mx-0 lg:mx-2"/>
          <Facebook size={24}  class="mx-0 lg:mx-2"/>
          <Twitter size={24}  class="mx-0 lg:mx-2"/>
          <Instagram size={24}  class="mx-0 lg:mx-2"/>
          <Linkedin size={24}  class="mx-0 lg:mx-2"/>
        </div>
      </div>
    </div>
  );
};

export default Footer;
