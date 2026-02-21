"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ICON_SIZE = 16;

const themes = [
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "warm", label: "Cyberpunk", Icon: Palette },
  { value: "rose", label: "Modern", Icon: Palette },
  { value: "rose-dark", label: "Rose", Icon: Palette },
];

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const current = themes.find((t) => t.value === theme) ?? themes[0];
  const Icon = current.Icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Icon size={ICON_SIZE} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content bg-background" align="start">
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          {themes.map(({ value, label, Icon: ItemIcon }) => (
            <DropdownMenuRadioItem key={value} className="flex gap-2 cursor-pointer" value={value}>
              <ItemIcon size={ICON_SIZE} className="text-muted-foreground" />
              <span>{label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
