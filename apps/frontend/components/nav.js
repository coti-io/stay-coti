"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ConnectKitButton } from "connectkit";
import { Button } from "./ui/button";
import useAuth from "@/hooks/useAuth";
import AccountModal from "@/components/account-modal";
import { useConnect } from "wagmi";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, isLoading } = useAuth();
  const { connect } = useConnect();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { label: "Stories", href: "/#Stories" },
    { label: "Events", href: "/#Events" },
    { label: "Ideas", href: "/#WAGMICetner" },
  ];

  return (
    <nav className="bg-white shadow-md z-50 w-full sticky top-0">
      <div className="w-full mx-auto bg-white">
        <div className="flex justify-between h-16 px-4 max-w-7xl mx-auto">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <svg width="100" height="32" viewBox="0 0 135 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1.0886382,13.6901754 C0.355358582,13.6901754 0,13.9826524 0,14.7307187 L0,31.9531168 C0,32.6786849 0.372280419,32.9936602 1.07735697,32.9992847 C9.43674456,33.0836531 19.5165189,25.6873587 27.9830782,19.9165616 L28,0 C19.6575342,5.70330232 9.23932313,13.8082911 1.0886382,13.6901754 Z"
                  fill="url(#paint0_linear)"
                />
                <path
                  d="M44.9107035,21.3098246 C45.6444265,21.3098246 46,21.0173476 46,20.2692813 L46,3.04688316 C46,2.32131512 45.6274945,2.00633984 44.9219915,2.00071528 C36.5575489,1.91634691 26.4716791,9.31264133 18,15.0834384 L18,35 C26.3305785,29.2966977 36.7381576,21.1917089 44.9107035,21.3098246 Z"
                  fill="url(#paint1_linear)"
                />
                <path
                  d="M28,20.0617676 L28,8.39672852 C24.5563657,10.5373626 21.1632081,12.9141534 18,15.1165906 L18,26.5854811 C21.4436343,24.4167547 24.8536175,22.2361124 28,20.0617676 Z"
                  fill="black"
                />
                <path
                  d="M68.8849861,14 C75.8624973,14 79.326194,18.1864472 79.326194,18.1864472 L76.7980296,22.0398162 C74.7335351,19.9716986 71.9800539,18.7964258 69.1021632,18.754977 C63.5001071,18.754977 59.4294281,23.0562787 59.4294281,28.9483155 C59.4294281,34.8403522 63.5112444,39.2335375 69.2803598,39.2335375 C74.4480617,39.2335375 77.856072,35.3859112 77.856072,35.3859112 L80,39.4058193 C80,39.4058193 76.1520668,44 68.8961234,44 C60.1589205,44 54,37.5968606 54,28.9942573 C54,20.5122511 60.1589205,14 68.8849861,14 Z"
                  fill="black"
                />
                <path
                  d="M94.0166852,14 C102.303671,14 109,20.283745 109,28.933946 C109,37.584147 102.325918,44 94.0166852,44 C85.7074527,44 79,37.6817921 79,28.933946 C79,20.1860999 85.7241379,14 94.0166852,14 Z M94.0166852,39.2728317 C99.2836485,39.2728317 103.566185,34.9707065 103.566185,28.968409 C103.566185,22.9661114 99.2836485,18.7731189 94.0166852,18.7731189 C88.7497219,18.7731189 84.461624,23.0235497 84.461624,28.968409 C84.461624,34.9132682 88.7997775,39.2383688 94.0166852,39.2383688 L94.0166852,39.2728317 Z"
                  fill="black"
                />
                <path
                  d="M112.597854,19.7669153 L109,19.7669153 L109,15.320467 L112.780234,15.320467 L112.780234,7 L117.908973,7 L117.908973,15.320467 L124.540962,15.320467 L124.540962,19.7669153 L117.908973,19.7669153 L117.908973,32.5974339 C117.908973,38.3795514 122.728219,39.0965339 124.745449,39.0965339 C125.166275,39.1019212 125.586558,39.0631803 126,38.9808916 L126,43.8841272 C125.384064,43.9647428 124.76377,44.0033717 124.143043,43.9997695 C120.600455,43.9997695 112.614434,42.8433461 112.614434,33.2219026 L112.597854,19.7669153 Z"
                  fill="black"
                />
                <path
                  d="M129,5 L135,5 L135,10.5365818 L129,10.5365818 L129,5 Z M129.062048,16.3114182 L135,16.3114182 L135,44 L129.086867,44 L129.062048,16.3114182 Z"
                  fill="black"
                />
                <defs>
                  <linearGradient id="paint0_linear" x1="57.3992748%" y1="84.1638481%" x2="45.1732474%" y2="25.4639103%">
                    <stop stopColor="black" offset="0%"></stop>
                    <stop stopColor="black" stopOpacity="0.69" offset="52%"></stop>
                    <stop stopColor="black" stopOpacity="0.5" offset="100%"></stop>
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="70.6149962%" y1="13.1022135%" x2="14.7961128%" y2="95.7987467%">
                    <stop stopColor="black" offset="0%"></stop>
                    <stop stopColor="black" stopOpacity="0.69" offset="49.1529815%"></stop>
                    <stop stopColor="black" stopOpacity="0.5" offset="100%"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="hidden sm:ml-6 sm:flex gap-4 sm:items-center">
            {isLoggedIn ? (
              <AccountModal />
            ) : (
              <ConnectKitButton.Custom>
                {({ show, isConnecting }) => {
                  return (
                    <Button onClick={show} variant="purple" disabled={isConnecting || isLoading}>
                      Connect Your Wallet
                    </Button>
                  );
                }}
              </ConnectKitButton.Custom>
              // <Button
              //   onClick={() =>
              //     connect({
              //       connector: metaMask(),
              //     })
              //   }
              //   variant="purple"
              // >
              //   Connect Your Wallet
              // </Button>
            )}
          </div>
          <div className="-mr-2 gap-2 flex items-center sm:hidden">
            {isLoggedIn ? (
              <AccountModal />
            ) : (
              <ConnectKitButton.Custom>
                {({ show, isConnecting }) => {
                  return (
                    <Button onClick={show} variant="purple" disabled={isConnecting || isLoading}>
                      Connect Your Wallet
                    </Button>
                  );
                }}
              </ConnectKitButton.Custom>
              // <Button
              //   onClick={() =>
              //     connect({
              //       connector: metaMask(),
              //     })
              //   }
              //   variant="purple"
              // >
              //   Connect Your Wallet
              // </Button>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden relative z-[60]">
          <div className="py-3 space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
