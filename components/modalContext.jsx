import { createContext } from "react"

const modalContext = createContext({
    isModal: false,
    setModal: (auth) => {},
})

export default modalContext
