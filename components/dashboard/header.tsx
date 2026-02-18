import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-end border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <div className="flex items-center gap-4">
                {/* User Profile / Auth Button can go here */}
            </div>
        </header>
    );
}
