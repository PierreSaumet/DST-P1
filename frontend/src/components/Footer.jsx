import { Link } from "react-router-dom";

import { Youtube, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Logo from "../assets/Links.png";

function Footer() {
  return (
    <div class="sticky bottom-0 w-full bg-white px-2 pb-5 text-black lg:px-40">
      <div class="flex flex-col content-center justify-between px-[50px] lg:flex-row">
        <div class="justify-content my-2 flex flex-col items-center lg:my-10">
          <img src={Logo} alt="Weeb logo" class="my-5" />
        </div>

        <div class="my-2 flex flex-col text-base font-normal lg:my-10">
          <h2 class="text-blue-gray my-5 font-medium">PRODUCT</h2>
          <Link class="my-3">Pricing</Link>
          <Link class="my-3">Overview</Link>
          <Link class="my-3">Browse</Link>
          <Link class="my-3">Accessibility</Link>
          <Link class="my-3">Five</Link>
        </div>
        <div class="my-2 flex flex-col text-base font-normal lg:my-10">
          <h2 class="text-blue-gray my-5 font-medium">SOLUTIONS</h2>
          <Link class="my-3">Brainstorming</Link>
          <Link class="my-3">Ideation</Link>
          <Link class="my-3">Wireframing</Link>
          <Link class="my-3">Research</Link>
        </div>
        <div class="my-2 flex flex-col text-base font-normal lg:my-10">
          <h2 class="text-blue-gray my-5 font-medium">RESSOURCES</h2>
          <Link class="my-3">Help Center</Link>
          <Link class="my-3">Blog</Link>
          <Link class="my-3">Tutorials</Link>
        </div>
        <div class="my-2 flex flex-col text-base font-normal lg:my-10">
          <h2 class="text-blue-gray my-5 font-medium">COMPANY</h2>
          <Link class="my-3">About</Link>
          <Link class="my-3">Press</Link>
          <Link class="my-3">Events</Link>
          <Link class="my-3">Careers</Link>
        </div>
      </div>

      <div class="mt-2 flex flex-col items-center border-t py-15 lg:flex-row lg:justify-between">
        <h2 class="">@ 2025 Weeb, Inc. All rights reserved.</h2>
        <div class="my-5 flex flex-row px-1 lg:my-0">
          <Youtube size={24} class="mx-0 lg:mx-2" />
          <Facebook size={24} class="mx-0 lg:mx-2" />
          <Twitter size={24} class="mx-0 lg:mx-2" />
          <Instagram size={24} class="mx-0 lg:mx-2" />
          <Linkedin size={24} class="mx-0 lg:mx-2" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
