import { createContext } from "react"

const contractFunctionContext = createContext({
    functionExecuted: "",
    setFunctionExecuted: (auth) => {},
})

export default contractFunctionContext
