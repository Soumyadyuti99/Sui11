'use client'
import MatchCard from "@/components/matchCards"
import {useEffect, useState} from 'react'

interface ApiResponse {
    data: IplMatch[];
  }

interface IplMatch{
    id: string;   
    dateTimeGMT: string;
    t1: string;
    t2: string;
    t1img: string;
    t2img: string;
    series: string;
}

interface SeriesAdWrapper {
    seriesId: number;
    seriesName: string;
    matches: {
        matchInfo: MatchInfo;
    }[];
}

interface MatchInfo {
    matchId: number;
    seriesId: number;
    seriesName: string;
    matchDesc: string;    
    startDate: string;
    team1: {
        teamId: number;        
        teamName: string;
        imageId: number;
    };
    team2: {
        teamId: number;        
        teamName: string;
        imageId: number;
    };
    venueInfo: {        
        ground: string;
        city: string;
        
    };    
    isTimeAnnounced: boolean;    
}

interface SeriesAdWrapper {
    seriesId: number;
    seriesName: string;
    matches: {
        matchInfo: MatchInfo;
    }[];
}

interface Match {
    matchType: string;
    seriesMatches: {
        seriesAdWrapper?: SeriesAdWrapper;        
    }[];
}


  const Matches = () => {
    const [iplmatches, setIplMatches] = useState<IplMatch[] | null>(null);  
    const [matches, setMatches] = useState<Match[]| null>(null)    
     

    const getAllMatches = async () => {
        const apikey2 = 'd17d6763-b06a-408a-96d9-63977332e8ee'
                
        
        const resp = await fetch(`https://api.cricapi.com/v1/cricScore?apikey=${apikey2}`)
        
        const ipldata: ApiResponse= await resp.json();            
        const matches: IplMatch[] = ipldata.data; //this is an array of objects containing match-info
        const iplMatches = matches ? matches.filter(match => match.series == "Indian Premier League 2024") : [];    
        
        const apikey = 'be9ae0365amsh4afc0ba9d32d263p13c11cjsn6155aca42a83'
        const resp2 = await fetch('https://cricbuzz-cricket.p.rapidapi.com/matches/v1/upcoming', {headers: {'X-RapidAPI-Key': apikey, 'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'}})
        const data = await resp2.json();
        const otherMatches = data.typeMatches.filter((match: Match) => match.matchType == 'International')

        const now = new Date();
        
        localStorage.setItem('iplmatches', JSON.stringify(iplMatches));
        localStorage.setItem('othermatches', JSON.stringify(otherMatches))
        localStorage.setItem('matchesFetchedTime', now.toString());
                   
        setIplMatches(iplMatches);
        setMatches(otherMatches);
    };

    useEffect(() => {
        const storedIplMatches = localStorage.getItem('iplmatches');
        const storedOtherMatches = localStorage.getItem('othermatches')
        const storedTime = localStorage.getItem('matchesFetchedTime');
        const now = new Date();

        if (storedIplMatches && storedOtherMatches &&  storedTime) {
            const timeDifference = (now.getTime() - new Date(storedTime).getTime()) / 1000 / 60; // in minutes

            if (timeDifference < 60) {
                setIplMatches(JSON.parse(storedIplMatches));
                setMatches(JSON.parse(storedOtherMatches))
                return; // Skip fetching as the stored data is still fresh
            }
        }       
        
        getAllMatches();
    }, []);

    

    return (
        <>
            <div>This will show all the available matches</div>
            <p>Upcoming IPL matches</p>
            {iplmatches && iplmatches.length > 0 ? (
                iplmatches.map(match => (
                    <MatchCard
                        key={match.id}
                        id={match.id}
                        t1={match.t1}
                        t2={match.t2}
                        t1img={match.t1img}
                        t2img = {match.t2img}
                        date={match.dateTimeGMT}                        
                        series={match.series}
                        t1id={match.t1}
                        t2id={match.t2}
                    />
                ))
            ) : (
                <p>No upcoming IPL matches</p>
            )}
            <p>Other matches</p>
            {matches && matches.length > 0 ? (
                matches.map(match => (
                    <div key={match.matchType}>
                        <h3>{match.matchType}</h3>
                        {match.seriesMatches.map((series, index) => (
                            <div key={index}>
                                {series.seriesAdWrapper && (
                                    <>
                                        <h4>{series.seriesAdWrapper.seriesName}</h4>
                                        {series.seriesAdWrapper.matches.map(matchDetails => (
                                            <MatchCard
                                                key={matchDetails.matchInfo.matchId}
                                                id={matchDetails.matchInfo.matchId.toString()}
                                                t1={matchDetails.matchInfo.team1.teamName}
                                                t2={matchDetails.matchInfo.team2.teamName}
                                                t1img={''}
                                                t2img={''}
                                                date={matchDetails.matchInfo.startDate}
                                                series={matchDetails.matchInfo.matchDesc}
                                                t1id= {`${matchDetails.matchInfo.team1.teamId}`}
                                                t2id={`${matchDetails.matchInfo.team2.teamId}`}
                                            />
                                        ))}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p>No other matches</p>
            )}
        </>
    );
};

export default Matches;
