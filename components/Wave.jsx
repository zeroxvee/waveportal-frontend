import { useContext, useState } from "react"
import {
    useContractWrite,
    usePrepareContractWrite,
    useAccount,
    useEnsAvatar,
    useEnsName,
} from "wagmi"
import wavePortal from "../utils/WavePortal.json"
import moment from "moment"
import { FaHeart, FaTrashAlt } from "react-icons/fa"
import modalContext from "./modalContext"
import Blockies from "react-blockies"
import contractFunctionContext from "../components/contractFunctionContext"
import { Tooltip } from "react-tooltip"

const Wave = ({ wave, id }) => {
    const { address: currentAccountAddress } = useAccount()
    const contractOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3" //localhost node
    // const contractAddress = "0x12adB1192e2ebfCf845A1826C504E882a27dfA4d"
    const contractABI = wavePortal.abi
    const { data: avatar, isErrorAvatar } = useEnsAvatar({
        address: wave.waver,
        onSuccess(data) {
            console.log("Success", data)
            console.log("Success", avatar)
        },
        onError(error) {
            console.log("Error", isErrorAvatar)
        },
    })
    const { setModal } = useContext(modalContext)

    /** Remove wave fx processors --------------------*/
    const { config: deleteWaveConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: contractABI,
        functionName: "deleteWave",
        args: [id],
    })
    const { write: deleteWave } = useContractWrite(deleteWaveConfig)

    const handleDeleteWave = () => {
        setFunctionExecuted("Delete Wave")
        deleteWave()
        setModal(true)
    }

    const { data, isError, isLoading } = useEnsName({
        address: wave.waver,
    })

    /** Like fx processors --------------------*/
    const { config: toggleLikeConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: contractABI,
        functionName: "toggleLike",
        args: [id],
    })

    const { write: toggleLike } = useContractWrite(toggleLikeConfig)

    const handleLike = async () => {
        setFunctionExecuted("Like Wave")
        toggleLike()
        setModal(true)
    }

    return (
        <div className="flex items-center justify-center border-b border-2 border-gray-900">
            <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 m-4 rounded-xl border w-full text-left">
                <div className="text-sm leading-tight flex items-center">
                    <span className="mr-1.5">
                        <Blockies seed={wave.waver} size={6} scale={3} className="rounded" />
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 font-normal block">
                        {wave.waver}
                    </span>
                </div>
                <div className="text-black dark:text-white block text-xl leading-snug mt-3">
                    {wave.message}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-base py-1 my-0.5">
                    {moment.unix(wave.timestamp).format("h:mm A · MMM D, YYYY")}
                </div>
                <div className="border-gray-200 dark:border-gray-600 border border-b-0 mt-1"></div>
                <div className="text-gray-500 dark:text-gray-400 flex mt-2 justify-between">
                    <div className="flex items-center mr-6">
                        <button>
                            <FaHeart onClick={handleLike} />
                        </button>
                        <span className="ml-2">{wave.likesAmount.toNumber()}</span>
                    </div>
                    {contractOwner == currentAccountAddress ||
                    wave.waver == currentAccountAddress ? (
                        <div data-tooltip-content="hello world!" id="removeWave">
                            <button className="removeButton" onClick={() => handleDeleteWave}>
                                <FaTrashAlt />
                            </button>
                            <Tooltip />
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    )
}

export default Wave
