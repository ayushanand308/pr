const Search=({search,setSearch,search_album})=>{
    return(
        <form className="searchForm" onSubmit={(e)=>e.preventDefault()}>
            <input 
            type="text" 
            id="search"
            role="searchbox"
            placeholder="search items"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            />
        </form>
    )
}

export default Search