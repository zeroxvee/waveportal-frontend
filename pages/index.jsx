import React, { useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Formik } from "formik"
import * as Yup from "yup"
import {
    useAccount,
    defaultChains,
    useContractWrite,
    usePrepareContractWrite,
    useContractEvent,
    useContractRead,
} from "wagmi"
import moment from "moment"
import wavePortal from "../utils/WavePortal.json"
import Navbar from "../components/Navbar"
import Wave from "../components/Wave"
import Footer from "../components/Footer"
import { Modal, Stepper } from "@web3uikit/core"
import TransactionModal from "../components/TransactionModal"

export default function Home() {
    const [allWaves, setAllWaves] = useState([])
    const [message, setMessage] = useState("")
    const [waveId, setWaveId] = useState(0)
    const [error, setError] = useState("")
    const { address: currentAccountAddress } = useAccount()
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3" //localhost node
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
    const { config: waveConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: contractABI,
        functionName: "wave",
        args: [message],
    })
    const { write: wave } = useContractWrite(waveConfig)

    useEffect(() => {
        getWaves()
    }, [])

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

    const handleMessage = async (e) => {
        let message = e.target.value
        setMessage(message)
        schema.validate({ text: message }).catch((err) => {
            if (err == null) {
                setError("")
            } else {
                setError(err.message)
            }
        })
    }

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
                    <Formik
                        initialValues={{ message: "" }}
                        validationSchema={Yup.object({
                            message: Yup.string()
                                .max(260)
                                .matches(/^[\w ]+$/, "Please no crazy symbols")
                                .required("Please enter your message"),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                alert(JSON.stringify(values, null, 2))
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
                            <form onSubmit={handleSubmit}>
                                <input
                                    placeholder="Send me a wave 👋"
                                    className="form-button m-2 dark:bg-gray-900 placeholder:italic"
                                    type="text"
                                    name="message"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.message}
                                />

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="form-button dark:bg-gray-900"
                                    onClick={wave}
                                >
                                    Wave at me Bro
                                </button>
                                {errors.message && touched.message ? (
                                    <div
                                        class="flex p-3 mb-6 bg-red-100 rounded-lg dark:bg-red-200"
                                        role="alert"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            class="flex-shrink-0 w-5 h-5 text-red-700 dark:text-red-800"
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
                                        <span class="sr-only">Info</span>
                                        <div class="ml-3 text-sm font-medium text-red-700 dark:text-red-800">
                                            {errors.message}
                                        </div>
                                    </div>
                                ) : null}
                            </form>
                        )}
                    </Formik>

                    <TransactionModal />
                    <section className="border-gray-900 border min-w-full max-w-screen-md">
                        {allWaves.length !== 0 ? (
                            allWaves.map((wave, key) => {
                                return (
                                    <div key={key}>
                                        <Wave wave={wave} id={key} />
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-xl">No waves yet. Be the first to wave!</div>
                        )}
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    )
}
