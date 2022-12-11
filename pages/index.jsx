import React, { createContext, useContext, useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Form, Field, Formik, useField } from "formik"
import * as Yup from "yup"
import {
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useContractEvent,
    useContractRead,
} from "wagmi"
import wavePortal from "../utils/WavePortal.json"
import Navbar from "../components/Navbar"
import Wave from "../components/Wave"
import Footer from "../components/Footer"
import modalContext from "../components/modalContext"
import TransactionModal from "../components/TransactionModal"
import contractFunctionContext from "../components/contractFunctionContext"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

export default function Home() {
    const { address: currentAccountAddress } = useAccount()
    const [allWaves, setAllWaves] = useState([])
    const [message, setMessage] = useState("")
    const [isModal, setModal] = useState(false)
    const [functionExecuted, setFunctionExecuted] = useState("")
    const [error, setError] = useState("")
    const messageField = useField("message")

    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3" //localhost node
    // const contractAddress = "0x12adB1192e2ebfCf845A1826C504E882a27dfA4d" //goerli testnet
    const contractOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    const contractABI = wavePortal.abi

    /** Get all waves fx processors --------------------*/
    const { refetch: fetchWaves } = useContractRead({
        address: contractAddress,
        abi: contractABI,
        functionName: "getWaves",
    })
    const getWaves = async () => {
        let { data: newWaves } = await fetchWaves()
        setAllWaves(newWaves)
    }

    /** Wave fx processors --------------------*/
    const {
        config: waveConfig,
        isError,
        isSuccess,
        isIdle,
        isLoading,
    } = usePrepareContractWrite({
        address: contractAddress,
        abi: contractABI,
        functionName: "wave",
        args: [message],
        onError(error) {
            setError(error)
            console.log(error)
        },
    })
    const { data: hash, write: wave } = useContractWrite(waveConfig)
    const handleWave = () => {
        console.log("useFormikContext = ", values.message)
        console.log("handleWave message: ", message)
        wave()
        setFunctionExecuted("Send Wave")
        setModal(true)
    }

    useEffect(() => {
        console.log(messageField)
        console.log("values = ")
        getWaves()
    })

    /** Contract listeners --------------------*/
    //
    //New wave listener
    useContractEvent({
        address: contractAddress,
        abi: contractABI,
        eventName: "NewWave",
        listener() {
            getWaves()
        },
    })

    //Like fx listener
    useContractEvent({
        address: contractAddress,
        abi: contractABI,
        eventName: "ToggleLike",
        listener() {
            getWaves()
        },
    })

    //Wave removed listener
    useContractEvent({
        address: contractAddress,
        abi: contractABI,
        eventName: "WaveRemoved",
        listener() {
            getWaves()
        },
    })

    return (
        <div>
            <Navbar />
            <div className="container mx-auto">
                <div className="dataContainer">
                    <div className="">
                        <div className="text-2xl my-2">👋 Hey there!</div>
                        <div className="text-2xl">
                            Name is Vladimir - I am a web3 enthusiast and self-taught developer.
                        </div>
                    </div>
                    <modalContext.Provider value={{ isModal, setModal }}>
                        <contractFunctionContext.Provider
                            value={{ functionExecuted, setFunctionExecuted }}
                        >
                            <Formik
                                initialValues={{ message: "" }}
                                validationSchema={Yup.object({
                                    message: Yup.string()
                                        .max(260)
                                        .matches(/^[\w!?@.\s]+$/, "Please no crazy symbols")
                                        .required("Please enter your message"),
                                })}
                                onSubmit={(values) => {
                                    console.log("Submitting message = ", values.message)
                                    // setMessage(values.message)
                                    setTimeout(() => {
                                        console.log("Message state change and now is = ", message)
                                        handleWave()
                                        setSubmitting(false)
                                    }, 400)
                                }}
                            >
                                {({
                                    values,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    isSubmitting,
                                }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Field
                                            id="input-field"
                                            placeholder="Send me a wave 👋"
                                            className="form-button m-2 dark:bg-gray-900 placeholder:italic"
                                            type="text"
                                            name="message"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.message}
                                            {...messageField}
                                        />

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || errors.message}
                                            className="form-button dark:bg-gray-900"
                                        >
                                            Wave at me Bro
                                        </button>
                                        {errors.message && touched.message ? (
                                            <div
                                                className="flex p-3 mb-6 bg-red-100 rounded-lg dark:bg-red-200"
                                                role="alert"
                                            >
                                                <svg
                                                    aria-hidden="true"
                                                    className="flex-shrink-0 w-5 h-5 text-red-700 dark:text-red-800"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                        clipRule="evenodd"
                                                    ></path>
                                                </svg>
                                                <span className="sr-only">Info</span>
                                                <div className="ml-3 text-sm font-medium text-red-700 dark:text-red-800">
                                                    {errors.message}
                                                </div>
                                            </div>
                                        ) : null}
                                    </Form>
                                )}
                            </Formik>
                            <TransactionModal
                                data={hash}
                                error={error}
                                isError={isError}
                                isSuccess={isSuccess}
                                isIdle={isIdle}
                                isLoading={isLoading}
                            />
                            <section className="border-gray-900 border min-w-full max-w-screen-md">
                                {allWaves && allWaves.length !== 0 ? (
                                    allWaves.map((wave, key) => {
                                        return (
                                            <div key={key}>
                                                <Wave wave={wave} id={key} />
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="text-xl">
                                        No waves yet. Be the first to wave!
                                    </div>
                                )}
                            </section>
                        </contractFunctionContext.Provider>
                    </modalContext.Provider>
                </div>
            </div>
            <Footer />
        </div>
    )
}
