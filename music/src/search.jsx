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
            <button className="searchButton" onClick={search_album}></button>
        </form>
    )
}

export default Search