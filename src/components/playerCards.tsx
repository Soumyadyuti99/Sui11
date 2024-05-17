import Image from "next/image";

interface PlayerCardProps {
    id: string;
    name: string;
    role: string;    
    playerImg:string;
    handle11selection: (arg0: string)=>void ;
    handleSubselection: (arg0: string)=>void ;
    selected: boolean;
  }
const PlayerCard: React.FC<PlayerCardProps> = ({id, name, role, playerImg, handle11selection, handleSubselection, selected})=>{    
    
    return (
        <div className={`p-4 border rounded-lg transition ${selected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}>
            <div className="flex items-center mb-2">
                <div className="w-12 h-12 relative">
                    {playerImg ? (
                        <Image src={playerImg} alt={`${name} image`} height={50}width={50} className="rounded-full"/>
                    ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    )}
                </div>
            </div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>            
            {selected ? (
                <p className="text-sm text-red-500">Selected</p>
            ) : (
                <div className="mt-2">
                    <button className="mr-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => handle11selection(id)}>Select as Playing 11</button>
                    <button className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-700" onClick={() => handleSubselection(id)}>Select as Substitute</button>
                </div>
            )}
        </div>
    );

}

export default PlayerCard