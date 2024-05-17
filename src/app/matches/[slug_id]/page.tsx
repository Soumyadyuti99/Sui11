'use client'
import MyPlaying11 from "@/components/myPlaying11";
import Subs from '@/components/subs'
import PlayerCard from "@/components/playerCards";
import { useParams } from "next/navigation";
import { useState, useEffect } from 'react';
import _ from 'lodash'
import Image from "next/image";

interface Players {
    id: string;
    name: string;
    role: string;    
    playerImg: string;
}

interface ApiResponse {
    data: { 
        teamname: string;
        img: string;
        players: Players[];
    }[]
}

interface Teams {
    teamname: string;
    img: string;
    players: Players[];
}

const MatchDetails = () => {
    const { slug_id } = useParams<{ slug_id: string }>();
    const matchId = slug_id.split('%3D%3D')[0]
    
    
    
    const [players, setPlayers] = useState<Players[] | null>(null);
    const [teams, setTeams] = useState<Teams[] | null>(null);
    const [myPlaying11, setmyPlaying11] = useState<Players[] | null>([]);
    const [subs, setSubs] = useState<Players[] | null>([]);
    const [captain, setCaptain] = useState <string| null>(null);
    const [vc, setVc] = useState <string| null>(null);    
    
    const checkPlayerSelected = (myPlaying11: Players[], subs: Players[], player: Players):boolean=>{
        const combinedArr = [...myPlaying11, ...subs]
        return _.some(combinedArr, pl => _.isEqual(pl, player));
    }

    const handle11selection= (id: string)=>{          
            if (players && players.length > 0) {
                if(myPlaying11 && myPlaying11.length>10){
                    alert('Cannot select more than 11 players in playing 11')
                    return null
                }
                const player = players.find(player => player.id === id);
                if (player) {
                    setmyPlaying11(prev => (prev ? [...prev, player] : [player]));
                }
            }
    }   

    const handleSubselection = (id: string)=>{          
        if (players && players.length > 0) {
            if(subs && subs.length>3){
                alert('cannot select more than 4 players in substitution');
                return null;
            }
            const player = players.find(player => player.id === id);
            if (player) {
                setSubs(prev => (prev ? [...prev, player] : [player]));
            }
        }
}   
    
    const removeSelection = (id:string, playerType: string)=>{        
        
        if (players && players.length > 0) {
            const player = players.find(player => player.id === id);
            if (player) {
                if(playerType=='pl11'){

                    setmyPlaying11(prev => (prev ? prev.filter(p => p.id!= id) : [player]));
                }
                else{
                    setSubs(prev => (prev ? prev.filter(p => p.id!= id) : [player]));
                }
            }
        }
        
    }
    
    const setAsCaptain = (id: string)=>{
        setCaptain(id)

    }

    const removeCaptain = ()=>{
        setCaptain(null)
    }

    const setAsVc = (id: string)=>{
        setVc(id)

    }

    const removeVc = ()=>{
        setVc(null)
    }

    const isSelectionValid = myPlaying11 && myPlaying11.length === 11 && subs && subs.length === 4 && captain !== null && vc !== null;

    const confirmSelection = () => {
        if (isSelectionValid) {
            // Handle the confirmation logic here
            console.log("Selection confirmed!");
        }
    };

    const getMatch = async () => {    
        if(matchId.length != 5){
            const apikey2 = 'd17d6763-b06a-408a-96d9-63977332e8ee';     
            const resp = await fetch(`https://api.cricapi.com/v1/match_squad?apikey=${apikey2}&id=${matchId}`);
            const data: ApiResponse = await resp.json();
            
            if (data && data.data) {
                const teams: Teams[] = data.data;               
                
                const allPlayers: Players[] = [...teams[0].players, ...teams[1].players];            
                
                setTeams(teams);
                setPlayers(allPlayers);
            }
        }
        else{
            const apikey = 'be9ae0365amsh4afc0ba9d32d263p13c11cjsn6155aca42a83';
            const t1id = Number((slug_id.split('%3D%3D')[1]).split('vs')[0]);
            const t2id = Number((slug_id.split('%3D%3D')[1]).split('vs')[1]);    
            
            
            const t1response = await fetch(`https://cricbuzz-cricket.p.rapidapi.com/teams/v1/${t1id}/players`, {headers: {'X-RapidAPI-Key': apikey, 'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'}});
            const t1data = await t1response.json()
            const t1players = t1data.player.filter((player: Players)=> player.id !=undefined)
            const t1name = {
                teamname: decodeURIComponent(slug_id.split('%3D%3D')[2].split('vs')[0]),
                img: '',
                players: [...t1players]
            }
            

            const t2response = await fetch(`https://cricbuzz-cricket.p.rapidapi.com/teams/v1/${t2id}/players`, {headers: {'X-RapidAPI-Key': apikey, 'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'}});
            const t2data = await t2response.json()
            const t2players = t2data.player.filter((player: Players)=> player.id !=undefined)

            const t2name = {
                teamname: decodeURIComponent(slug_id.split('%3D%3D')[2].split('vs')[1]),
                img: '',
                players: [...t2players]
            }

            setPlayers([...t1players, ...t2players])
            setTeams([t1name, t2name])

        }  
    };
    
    useEffect(() => {         
        
        getMatch();
    }, [slug_id]);
    
    return (
        <div className="container mx-auto p-4">            
            {teams && teams.length > 0 && (
                <>
                    <div className="flex flex-col md:flex-row md:justify-between mb-8">
                    <div className="md:w-1/2 md:mr-2">
                    <h3 className="text-xl font-semibold mb-2">Team 1: {teams[0].teamname}</h3>
                    <Image src={teams[0].img} alt={teams[0].teamname} height={60} width={60} className="object-cover mb-4"/>
                    <h4 className="text-lg font-medium mb-2">Players:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myPlaying11 && subs && teams[0].players.map(player =>                        
                             (<PlayerCard
                                key={player.id}
                                id = {player.id}
                                name={player.name}
                                role={player.role}                                
                                playerImg={player.playerImg}
                                handle11selection={handle11selection}
                                handleSubselection={handleSubselection}
                                selected = {checkPlayerSelected(myPlaying11, subs, player)}                                
                            />)                       
                        
                    )}
                    </div>
                    </div>
                    <div className="md:w-1/2 md:ml-2">
                    <h3 className="text-xl font-semibold mb-2">Team 2: {teams[1].teamname}</h3>
                    <Image src={teams[1].img} alt={teams[1].teamname} height={60} width={60} className="object-cover mb-4"/>
                    <h4 className="text-lg font-medium mb-2">Players:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myPlaying11 && subs && teams[1].players.map(player => 
                        
                            (<PlayerCard
                                key={player.id}
                                id={player.id}
                                name={player.name}
                                role={player.role}                                
                                playerImg={player.playerImg}
                                handle11selection={handle11selection}
                                handleSubselection={handleSubselection}
                                selected={checkPlayerSelected(myPlaying11, subs, player)}                                
                            />)                       
                        
                    )}
                    </div>
                    </div>
                    </div>
                </>
            )}
            {!teams && <p>Loading match details...</p>}
            <h3 className="text-xl font-semibold mb-2">My Playing 11</h3>
            {myPlaying11 && myPlaying11.length>0? myPlaying11.map(player=>
                <MyPlaying11
                key={player.id}
                id={player.id}
                name={player.name}
                role={player.role}
                removeSelection={removeSelection}
                setAsCaptain = {setAsCaptain}
                setAsVc = {setAsVc}
                removeCaptain = {removeCaptain}
                removeVc = {removeVc}
                isCap = {player.id==captain}
                isVc = {player.id==vc}
                />
            ): <div className="mb-4">You have not selected any player yet</div>}

            <h3 className="text-xl font-semibold mb-2">My substitutes</h3>
            {subs && subs.length>0? subs.map(player=>
                <Subs
                key={player.id}
                id={player.id}
                name={player.name}
                role={player.role}
                removeSelection={removeSelection}
                />
            ): <div className="mb-4">You have not selected any player yet</div>}

            <button
                onClick={confirmSelection}
                disabled={!isSelectionValid}
                className={`mt-4 px-4 py-2 font-semibold text-white rounded ${isSelectionValid ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                title={!isSelectionValid ? "Please select 11 players, 4 substitutes, and assign captain and vice-captain." : ""}
            >
                Confirm Selection
            </button>
            
        </div>
    );
};

export default MatchDetails;
