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
    const loadScore = (locale: string | undefined, chapter: number) => {
        const key = `locale_${locale}_chapter_${chapter}`;
        const storedScore = localStorage.getItem(key);
        return storedScore ? parseInt(storedScore, 10) : 0;
    };

    return (
        <div className="flex mx-auto max-w-3xl h-screen w-full mt-12 max-md:mt-0 max-md:p-5 bg-white">
            <div className="border-4 border-black rounded-md w-full p-4 grid grid-cols-4 max-md:grid-cols-2 gap-4">
                {allChapters?.data?.map((chapter: number) => {
                    const score = loadScore(locale, chapter);
                    console.log(Math.floor(score / 10))
                    return (
                        <div className="border-2 border-black rounded-md p-4 h-40" key={chapter}>
                            <div className="flex flex-col gap-4 items-center">
                                <h6 className="font-medium text-lg">{t.level} {chapter}</h6>
                                <Rating
                                    name="simple-controlled"
                                    value={score / 30} // Puanı 10'a bölerek yıldız sayısını belirleyin
                                    max={3}
                                    precision={0.1} // 10 üzerinden puanlamayı göstermek için precision'ı 0.1 olarak ayarlayın
                                    readOnly
                                />
                                <Link href={`/game?level=${chapter}`} className="text-center bg-green-400 rounded-md text-white w-full text-md font-medium shadow-md py-2">
                                    {t.play}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}