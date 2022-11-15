import { ConnectKitButton } from "connectkit"
import { useEffect } from "react"

const Navbar = ({ avatar }) => {
    return (
        <nav className="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
            <div className="container flex justify-between items-center max-w-full">
                <a href="https://flowbite.com/" className="flex items-center">
                    <span className="mr-1 sm:h-9 text-3xl pb-1">👋</span>
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                        WavePortal
                    </span>
                </a>
                <div className="mx-1 flex md:order-2">
                    <ConnectKitButton
                        showBalance={true}
                        showAvatar={true}
                        hideNoWalletCTA={true}
                    />
                </div>
            </div>
        </nav>
    )
}

export default Navbar
