"use client";

import * as Toolbar from "@radix-ui/react-toolbar";
import * as Tooltip from "@radix-ui/react-tooltip";
import { IconBrandGithub, IconSettings } from "@tabler/icons-react";
import Link from "next/link";

import SettingMenu from "./settingMenu";

const Header = () => {
  return (
    <Toolbar.Root className="mx-4 my-2 flex items-center justify-between text-coffee-600">
      <Toolbar.Link asChild>
        <div className="rounded-lg px-4 py-2 outline-none focus:bg-hover">
          <Link
            href="/"
            className="bg-gradient-to-r from-coffee-700 to-coffee-500 bg-clip-text p-1 font-oxanium text-4xl font-extrabold text-transparent"
          >
            CaffeBruncher
          </Link>
        </div>
      </Toolbar.Link>
      <Tooltip.Provider delayDuration={200}>
        <div className="flex">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Toolbar.Link asChild>
                <Link
                  href="https://github.com/cffnpwr/caffe-bruncher"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m-1 rounded-full p-3 outline-none duration-300 hover:bg-hover focus:bg-hover"
                >
                  <IconBrandGithub />
                </Link>
              </Toolbar.Link>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="my-2 animate-fadeIn rounded-md bg-neutral-100 p-2 drop-shadow radix-state-closed:animate-fadeOut radix-state-delayed-open:animate-fadeIn">
                Githubリポジトリ
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <SettingMenu>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Toolbar.Button className="m-1 rounded-full p-3 outline-none duration-300 hover:bg-hover focus:bg-hover">
                  <IconSettings />
                </Toolbar.Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="my-2 animate-fadeIn rounded-md bg-neutral-100 p-2 drop-shadow radix-state-closed:animate-fadeOut radix-state-delayed-open:animate-fadeIn">
                  設定
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </SettingMenu>
        </div>
      </Tooltip.Provider>
    </Toolbar.Root>
  );
};

export default Header;
