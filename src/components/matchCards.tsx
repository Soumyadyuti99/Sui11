import { DateTime } from 'luxon';
import Image from 'next/image';
import Link from 'next/link';
import countries from "i18n-iso-countries";
import Flag from 'react-flagkit';

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

interface MatchCardProps { 
    id: string;   
    t1: string;
    t2: string;
    t1img: string;
    t2img: string;
    date: string;    
    series: string;
    t1id: string;
    t2id: string;
}

const MatchCard: React.FC<MatchCardProps> = ({ id, t1, t2, t1img, t2img, date, series, t1id, t2id }) => {
    let myTime = '';
    let formattedDate = '';
    const t1country = t1img.length==0? countries.getAlpha2Code(t1, 'en'): '';
    const t2country = t2img.length==0? countries.getAlpha2Code(t2, 'en'): '';    

    if (/^\d+$/.test(date)) {
        // Assuming the timestamp is in seconds
        const startDateTime = DateTime.fromMillis(Number(date));
        formattedDate = startDateTime.toFormat('cccc, d LLL yyyy, h:mm a');
    } else {
        // Assuming the date is in ISO format
        const dateTime = DateTime.fromISO(date, { zone: 'UTC' });
        myTime = dateTime.setZone('Asia/Kolkata').toFormat('h:mma');
        formattedDate = dateTime.toFormat('MMMM d, yyyy');
    }

    return (
        <Link href={`/matches/${id}==${t1id}vs${t2id}==${t1}vs${t2}`} className="match-card block hover:bg-gray-100 p-4 border rounded-lg transition no-underline">
            <div className="flex items-center space-x-4">
                {t1img.length > 0 ? <Image src={t1img} width={50} height={50} alt={`${t1} logo`} /> : <Flag country={t1country} size={30}/>}
                <span>{t1} vs {t2}</span>
                {t2img.length > 0 ? <Image src={t2img} width={50} height={50} alt={`${t2} logo`} /> : <Flag country={t2country} size={30}/>}
            </div>
            {!(/^\d+$/.test(date)) ? (
                <>
                    <p>{myTime}</p>
                    <p>{formattedDate}</p>
                </>
            ) : <p>{formattedDate}</p>}
            <p>{series}</p>
        </Link>
    );
};

export default MatchCard;
