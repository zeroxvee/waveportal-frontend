import Link from "next/link"
import { FaHeart } from "react-icons/fa"

const Footer = () => {
    return (
        <footer className="text-center bg-gray-900 text-white fixed bottom-0 left-0 w-full block">
            <p className="flex justify-center text-center py-3">
                Made with ❤️ by
                <Link className="pl-1 text-yellow-300" href="https://github.com/vbazhutin">
                    vbazhutin
                </Link>
            </p>
        </footer>
    )
}

export default Footer
