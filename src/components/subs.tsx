interface SubsProps{
    id: string
    name: string;
    role: string;
    removeSelection: (arg0: string, arg1: string)=>void
}

const subs: React.FC<SubsProps> =  ({id, name,role, removeSelection})=>{
    return (
        <div className="hover:bg-gray-100 p-4 border rounded-lg transition">
            <p>{name}</p>
            <p>{role}</p>
            <button className="mr-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700" onClick={()=> removeSelection(id, 'sub')}>Remove</button>
        </div>
    )
}
export default subs