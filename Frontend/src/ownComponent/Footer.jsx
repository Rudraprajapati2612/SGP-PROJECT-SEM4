import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

function Footer() {
    return (
        <footer className=" text-gray-400 py-12">
            <div className="max-w-[1240px] mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
                {/* Contact Section */}
                <div>
                    <h1 className="text-white font-bold text-2xl mb-4">Contact Us</h1>
                    <p className="font-semibold">
                        Charotar Greens Ave, <br />
                        Changa-Karoli Road <br />
                        Changa, 388421, India
                    </p>
                    <p className="mt-2 font-semibold">Phone: +91 97277 65994</p>
                </div>

                {/* Quick Links */}
                <div>
                    <h1 className="text-white font-bold text-2xl mb-4">Quick Links</h1>
                    <ul className="space-y-2 font-semibold">
                        <li><a href="" className="hover:text-white transition">Terms & Conditions</a></li>
                        <li><a href="" className="hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="" className="hover:text-white transition">FAQs</a></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h1 className="text-white font-bold text-2xl mb-4">Follow Us</h1>
                    <div className="flex justify-center md:justify-start space-x-6">
                        <a href="" className="text-gray-400 hover:text-white transition text-2xl">
                            <FaFacebookF />
                        </a>
                        <a 
  href="https://www.instagram.com/shreedeep_hostel?igsh=MWsxbHhteGdudXZrcA%3D%3D&utm_source=qr" 
  className="text-gray-400 hover:text-white transition text-2xl"
  target="_blank" 
  rel="noopener noreferrer"
>
  <FaInstagram />
</a>

                        <a href="" className="text-gray-400 hover:text-white transition text-2xl">
                            <FaXTwitter />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-700 pt-6">
                &copy; {new Date().getFullYear()} Shreedeep Hostel. All Rights Reserved.
            </div>
        </footer>
    );
}

export default Footer;
