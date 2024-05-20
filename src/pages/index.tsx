import Link from "next/link";
import { useRouter } from "next/router";
import en from "../../locales/en";
import tr from "../../locales/tr";

export default function Home() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "en" ? en : tr;

  const changeLanguage = (e: string) => {
    const locale = e;
    console.log(e)
    router.push(router.pathname, router.asPath, { locale });
  };


  return (
    <div className="bg-white">
      <div className="flex h-screen">
        <div className="m-auto">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <button className={`bg-black rounded-full text-white px-8 py-5 w-60 max-md:w-full text-xl font-medium shadow-md ${locale === "tr" && "border-4 border-green-400"}`} onClick={() => changeLanguage("tr")}>{t.turkish}</button>
              <button className={`bg-black rounded-full text-white px-8 py-5 w-60 max-md:w-full text-xl font-medium shadow-md ${locale === "en" && "border-4 border-green-400"}`} onClick={() => changeLanguage("en")}>{t.english}</button>
            </div>
            <Link href={'/alllevel'} className="text-center bg-green-400 rounded-full text-white px-6 py-4 w-full text-xl font-medium shadow-md">{t.play}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}