import { Rating } from "@mui/material";
import { useRouter } from "next/router";
import tr from "../../locales/tr";
import en from "../../locales/en";
import { trpc } from "@/utils/trpc";
import Link from "next/link";

export default function AllLevel() {
    const router = useRouter();
    const { locale } = router;
    const t = locale === "en" ? en : tr;

    const allChapters: any = trpc.game.getChapters.useQuery();
    
    // const handleClick = () => {
    //     router.push({
    //         pathname: router.pathname,
    //         query: currentQuery,
    //     }, undefined, { scroll: false });
    // }
    return (
        <div className="flex mx-auto max-w-3xl h-screen w-full mt-12 max-md:mt-0 max-md:p-5 bg-white">
            <div className="border-4 border-black rounded-md w-full p-4 grid grid-cols-4 max-md:grid-cols-2 gap-4">
                {allChapters?.data?.map((chapter: number) => (
                    <div className="border-2 border-black rounded-md p-4 h-40">
                        <div className="flex flex-col gap-4 items-center">
                            <h6 className="font-medium text-lg">{t.level} {chapter}</h6>
                            <Rating
                                name="simple-controlled"
                                value={1}
                                max={3}
                                onChange={(event, newValue) => {
                                    // setValue(newValue);
                                }}
                            />
                            <Link href={`/game?level=${chapter}`} className="text-center bg-green-400 rounded-md text-white w-full text-md font-medium shadow-md py-2">{t.play}</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}