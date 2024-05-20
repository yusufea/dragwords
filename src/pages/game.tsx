import React, { useEffect, useState } from "react";
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Droppable from '../components/Droppable';
import { arrayMove, insertAtIndex, removeAtIndex } from "../utils/array";
import { trpc } from "@/utils/trpc";
import DoneIcon from '@mui/icons-material/Done';
import { useRouter } from "next/router";

function Game() {
    const router = useRouter();
    const { locale }: any = router;

    const [time, setTime] = useState<{ hours: number, minutes: number, seconds: number }>({
        hours: 0,
        minutes: 1,
        seconds: 0
    });

    const [backgroundColor, setBackgroundColor] = useState('bg-white');

    useEffect(() => {
        const countdown = setInterval(() => {
            if (time.seconds > 0) {
                setTime(prevTime => ({ ...prevTime, seconds: prevTime.seconds - 1 }));
            } else if (time.minutes > 0) {
                setTime(prevTime => ({ hours: prevTime.hours, minutes: prevTime.minutes - 1, seconds: 59 }));
            } else if (time.hours > 0) {
                setTime(prevTime => ({ hours: prevTime.hours - 1, minutes: 59, seconds: 59 }));
            } else {
                clearInterval(countdown);
            }
        }, 1000);

        return () => clearInterval(countdown);
    }, [time]);

    const [items, setItems] = useState<any>({
        group1: [],
        group2: []
    });

    // const chars: any = trpc.game.getChars.useQuery();
    // const words: any = trpc.game.getWords.useQuery();

    const [chars, setChars] = useState<any>();
    const [words, setWords] = useState<any>();
    const wordsMutation = trpc.game.getWords.useMutation();
    const charsMutation = trpc.game.getChars.useMutation();

    const GetWords = async () => {
        const words = await wordsMutation.mutateAsync({ locale: locale, chapter: parseInt(router.query.level as any) });
        setWords(words)
    }
    const GetChars = async () => {
        console.log(router.query.level, "router.query.level")
        const chars = await charsMutation.mutateAsync({ locale: locale, chapter: parseInt(router.query.level as any) });
        setChars(chars)
    }
    console.log(locale)
    useEffect(() => {
        if (router.query.level) {
            GetWords()
            GetChars()
        }
    }, [router.query.level])
    // Effect to update group1 with fetched chars
    useEffect(() => {
        if (chars) {
            const charscs = chars.map((item: any) => item.char);
            setItems((prevItems: any) => ({
                ...prevItems,
                group1: charscs
            }));
        }
    }, [chars]);

    const sensors = useSensors(
        useSensor(TouchSensor),
        useSensor(PointerSensor),
        useSensor(KeyboardSensor),
    );



    const handleDragOver = ({ over, active }: { over: any, active: any }) => {
        const overId = over?.id;

        if (!overId) {
            return;
        }

        const activeContainer = active.data.current.sortable.containerId;
        const overContainer = over.data.current?.sortable.containerId;

        if (!overContainer) {
            return;
        }

        if (activeContainer !== overContainer) {
            setItems((items: any) => {
                const activeIndex = active.data.current.sortable.index;
                const overIndex = over.data.current?.sortable.index || 0;

                return moveBetweenContainers(
                    items,
                    activeContainer,
                    activeIndex,
                    overContainer,
                    overIndex,
                    active.id
                );
            });
        }
    };

    const handleDragEnd = ({ active, over }: { active: any, over: any }) => {
        if (!over) {
            return;
        }

        if (active.id !== over.id) {
            const activeContainer = active.data.current.sortable.containerId;
            const overContainer = over.data.current?.sortable.containerId || over.id;
            const activeIndex = active.data.current.sortable.index;
            const overIndex = over.data.current?.sortable.index || 0;

            setItems((items: any) => {
                let newItems;
                if (activeContainer === overContainer) {
                    newItems = {
                        ...items,
                        [overContainer]: arrayMove(
                            items[overContainer],
                            activeIndex,
                            overIndex
                        )
                    };
                } else {
                    newItems = moveBetweenContainers(
                        items,
                        activeContainer,
                        activeIndex,
                        overContainer,
                        overIndex,
                        active.id
                    );
                }

                return newItems;
            });
        }
    };

    const moveBetweenContainers = (
        items: { [x: string]: any; group1?: string[]; group2?: string[]; group3?: string[]; },
        activeContainer: string | number,
        activeIndex: any,
        overContainer: string | number,
        overIndex: any,
        item: any
    ) => {
        return {
            ...items,
            [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
            [overContainer]: insertAtIndex(items[overContainer], overIndex, item)
        };
    };

    const [valueText, setValueText] = useState<any>("");
    const handleButtonClick = () => {
        console.log("asdasdasd")
        const group2Word = items.group2.join('').toLowerCase().replace(/i̇/g, 'i') || valueText;
        const matchingWord = words.find((word: any) => word.word === group2Word);

        words.forEach((word: any) => console.log(word.word, group2Word));

        if (matchingWord) {
            setTime(prevTime => {
                let newSeconds = prevTime.seconds + 15;
                let newMinutes = prevTime.minutes;
                let newHours = prevTime.hours;

                if (newSeconds >= 60) {
                    newSeconds -= 60;
                    newMinutes += 1;
                }

                if (newMinutes >= 60) {
                    newMinutes -= 60;
                    newHours += 1;
                }

                return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
            });

            // Doğru tahmin için arka planı yeşil yap
            setBackgroundColor('bg-green-600');
            setTimeout(() => setBackgroundColor('bg-white'), 800); // 1 saniye sonra normale dön

        } else {
            // Yanlış tahmin için arka planı kırmızı yap
            setBackgroundColor('bg-red-600');
            setTimeout(() => setBackgroundColor('bg-white'), 800);// 1 saniye sonra normale dön

        }

        setItems((prevItems: any) => ({
            ...prevItems,
            group1: [...chars.map((item: any) => item.char)],
            group2: []
        }));
    };

    useEffect(() => {
        let intervalId: any;

        if (time.hours === 0 && time.minutes === 0 && time.seconds < 10) {
            intervalId = setInterval(() => {
                setBackgroundColor((prevColor) =>
                    prevColor === 'bg-red-600' ? 'bg-white' : 'bg-red-600'
                );
            }, 500); // 0.5 saniyede bir yanıp sönsün

            // 10 saniye sonra interval'i durdur
            setTimeout(() => {
                clearInterval(intervalId);
                setBackgroundColor('bg-white'); // Arka plan rengini temizle
            }, 7000);
        }

        // useEffect temizleme fonksiyonu
        return () => clearInterval(intervalId);
    }, [time]);

    console.log(backgroundColor)
    return (
        <div className={`${backgroundColor} h-screen`} style={{ transition: 'background-color 0.5s ease' }}>
            <div className="flex justify-end p-5 max-md:p-3 max-md:py-5">
                <span className="countdown font-mono text-4xl">
                    <span style={{ "--value": time.hours } as React.CSSProperties}></span>:
                    <span style={{ "--value": time.minutes } as React.CSSProperties}></span>:
                    <span style={{ "--value": time.seconds } as React.CSSProperties}></span>
                </span>
            </div>
            <div className="max-w-3xl mx-auto max-md:p-4">
                <div className="max-md:hidden">
                    <DndContext
                        sensors={sensors}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                    >
                        <div className="flex flex-col gap-12">
                            {Object.keys(items).map((group) => (
                                <Droppable id={group} items={items[group]} key={group} />
                            ))}
                        </div>
                    </DndContext>
                </div>
                <div className="md:hidden">
                    <div className="flex flex-col gap-12">
                        <div className="flex gap-2 justify-center">
                            {chars?.map((item: any) => (

                                <div>
                                    <h6 className="font-medium text-lg">
                                        {item.char}
                                    </h6>
                                </div>
                            ))}
                        </div>
                        <div className="mb-6">
                            <input onChange={(e) => setValueText(e.target.value)} type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center w-full">
                    <button onClick={handleButtonClick} style={{ marginTop: 20 }}>
                        <DoneIcon className="!w-16 !h-20 !bg-black !text-white !p-1 !rounded-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Game;
