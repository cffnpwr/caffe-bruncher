import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Select from "@radix-ui/react-select";
import {
  IconBrandTwitter,
  IconChevronDown,
  IconInfoCircle,
  IconLanguageHiragana,
  IconSquareRoundedLetterM,
} from "@tabler/icons-react";
import Link from "next/link";

const SettingMenu = ({ children }: { children: React.ReactNode }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div>{children}</div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mx-4 animate-slideDownAndFadeIn rounded-md bg-neutral-100 p-2 drop-shadow-lg radix-state-closed:animate-slideDownAndFadeOut radix-state-open:animate-slideDownAndFadeIn">
          <DropdownMenu.Label className="flex items-center p-1 text-lg">
            <IconBrandTwitter className="mr-2" />
            Twitterアカウント
          </DropdownMenu.Label>
          <DropdownMenu.Label className="flex items-center p-1 text-lg">
            <IconSquareRoundedLetterM className="mr-2" />
            Misskeyアカウント
          </DropdownMenu.Label>
          <DropdownMenu.Separator className="m-2 h-1px bg-neutral-300" />
          <DropdownMenu.Label className="flex items-center p-1 text-lg">
            <IconLanguageHiragana className="h-6" />
            言語
          </DropdownMenu.Label>
          <Select.Root>
            <Select.Trigger className="mx-1 inline-flex items-center justify-between rounded px-3 py-1 text-lg outline outline-1 outline-neutral-300 hover:bg-hover focus:bg-hover">
              <Select.Value placeholder="Select language..." />
              <Select.Icon>
                <IconChevronDown />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content>
                <Select.Viewport>
                  <Select.Item value="ja-jp">
                    <Select.ItemText>日本語</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <DropdownMenu.Separator className="m-2 h-1px bg-neutral-300" />
          <DropdownMenu.Item asChild>
            <Link
              href="/about"
              className="flex items-center rounded p-1 text-lg outline-none hover:bg-hover focus:bg-hover"
            >
              <IconInfoCircle className="mr-2" />
              CaffeBruncherについて
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SettingMenu;
