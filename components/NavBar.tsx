'use client';
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/dist/client/components/navigation";
import {cn} from "@/lib/utils";
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';

const navItems = [
    { label: "Library", href: "/" },
    { label: "Add New", href: "/books/new" },
]

const NavBar = () => {
      const pathName = usePathname();
    return (
        <header className="w-full fixed z-50 bg-(--bg-primary)">
            <div className="wrapper navbar-height py-4 flex
            justify-between items-center">
                <Link href="/" className="flex gap-0.5 items-center"/>
                <Image src="/assets/logo.png" alt="bookified"
                       width={42} height={26}/>
                       <span className="logo-text">Bookified</span>
                <link/>
                <nav className="w-fit flex gap-7.5 items-center">
                    {navItems.map(( {label, href }) => {
                        const isActive = pathName === href ||
                            (href !== '/' && pathName.startsWith(href));
                        return (
                            <Link href={href} key={label}
                            className={cn('nav-link-base',
                            isActive ? 'nav-link-active' :
                            'text-black hover:opacity-70')}>
                                {label}
                            </Link>
                        )
                    })}
                    <Show when="signed-out">
                        <div className="flex gap-4 items-center">
                            <SignInButton mode="modal">
                                <button className="nav-link-base text-black hover:opacity-70">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="nav-link-base text-black hover:opacity-70">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </div>
                    </Show>
                    <Show when="signed-in">
                        <UserButton afterSignOutUrl="/sign-in" />
                    </Show>
                </nav>
                </div>
            </header>
    )
}
export default NavBar
