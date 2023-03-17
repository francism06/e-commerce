import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import {
    doc,
    getDoc
} from "firebase/firestore";

import { Icon } from "@iconify/react";

export const Slider = ({ content }) => {
    const [images, setImages] = useState([]);
    const [displayImage, setDisplayImage] = useState(0);

    const handleHover = (index) => {
        setDisplayImage(index);
    };

    useEffect(() => {
        if (content && content.length) {
            setImages(content);
        }
    }, [content]);

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <div className="w-full bg-white border-4 border-black  drop-shadow-primary">
                {
                    images.length && (
                        <img className="w-full object-fill p-8" src={images[displayImage].url} />
                    )
                }
            </div>
            <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 w-full place-items-center gap-4">
                    {
                        images.length && (
                            images.map((image, index) => {
                                return (
                                    <button onMouseEnter={() => handleHover(index)} key={index} className="bg-white border-4 w-fit border-black p-4   drop-shadow-primary hover:drop-shadow-tertiary transition-all">
                                        <img className="w-14 h-14 lg:w-20 lg:h-20 xl:w-26 xl:h-26 object-cover" src={image.url} />
                                    </button>
                                )
                            })
                        )
                    }
                </div>
            </div>
        </div>
    )
}