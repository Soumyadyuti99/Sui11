interface myTeamProps{
    id: string
    name: string;
    role: string;
    removeSelection: (arg0: string, arg1: string)=>void;
    setAsCaptain : (arg0: string)=> void;
    setAsVc : (arg0: string)=> void;
    removeCaptain : ()=> void;
    removeVc : ()=> void;
    isCap: boolean;
    isVc: boolean;
}
const MyPlaying11: React.FC<myTeamProps> = ({id, name,role, removeSelection, setAsCaptain, setAsVc, removeCaptain, removeVc, isCap, isVc})=>{
    return (
        <div className="hover:bg-gray-100 p-4 border rounded-lg transition">
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
            <div className="mt-2">
            {isCap? <button className="mr-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700" onClick={()=>removeCaptain()}>Remove from captaincy</button>:<button className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={()=> {
                setAsCaptain(id)
                isVc? removeVc():null
                }}>Appoint captain</button>} 
            {isVc? <button className="mr-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700" onClick={()=>removeVc()}>Remove from vice-captaincy</button>: <button className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700" onClick={()=> {
                setAsVc(id)
                isCap? removeCaptain(): null
            }}>Appoint vice-captain</button>}
            <button className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-700" onClick={()=> {
                isCap? removeCaptain():null
                isVc? removeVc():null
                removeSelection(id, 'pl11')}}>Remove</button>
        </div>
        </div>
    )
}

export default MyPlaying11;