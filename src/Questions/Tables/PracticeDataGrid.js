import React, { useEffect, useState } from 'react'

const PracticeDataGrid = () => {
    const [users, setUsers] = useState([])
    const [filterList, setFilteredList] = useState([]);
    const [search, setSearch] = useState('');
    const [sortTech, setSortTech] = useState(null);
    const [currentSortedField, setCurrentSortedField] = useState(null);
    const [columnHide, setColumnHide] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const PAGE_SIZE = 10;
    const noOfTabs = Math.ceil(filterList.length/PAGE_SIZE);
    const startData = PAGE_SIZE * (currentPage - 1);
    const endData = PAGE_SIZE * currentPage;

    const fetchUsers = async () => {
        const usersData = await fetch('https://dummyjson.com/users?limit=100')
        const users = await usersData.json();
        const transformed = users?.users?.map(({ id, firstName, age, gender, birthDate }) => {
            return { id, firstName, age, gender, birthDate }
        })
        setUsers(transformed);
        setFilteredList([...transformed]);
    }

    useEffect(() => {
        try {
            fetchUsers();
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleDelete = (id) => {
        const filteredData = filterList.filter(u => u.id !== id)
        setFilteredList(filteredData);
    }

    const handleSearch = () => {
        const filterList = users.filter(u => Object.values(u).join(" ").toLowerCase().includes(search.toLowerCase()))
        setFilteredList(filterList)
    }

    const handleSort = (field) => {
        setCurrentSortedField(field);
        const sortedData = filterList.sort((a, b) => {
            if (field === "birthDate") {
                return sortTech === null ? new Date(a[field]) - new Date(b[field]) : new Date(b[field]) - new Date(a[field]);
            } else {
                if (typeof a[field] === "string") {
                    return sortTech === null ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
                } else {
                    return sortTech === null ? a[field] - b[field] : b[field] - a[field];
                }
            }

        })
        setFilteredList(sortedData);

        if (sortTech === null) {
            setSortTech("asc")
        } else if (sortTech === "asc") {
            setSortTech("desc");
        } else if (sortTech === "desc") {
            setSortTech(null);
            setFilteredList(users);
        }

    }

    const handleHideColumn = (e, field) => {
        if (e.target.checked) {
            setColumnHide(prev => [...prev, field]);
        } else {
            setColumnHide(prev => prev.filter(h => h !== field));
        }
    }

    const handlePageChange = (pageNo) => {
        setCurrentPage(pageNo);
    }

    const handlePrev = () => {
        setCurrentPage(prev => prev - 1);
    }

    const handleNext = () => {
        setCurrentPage(prev => prev + 1);
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: "10px" }}>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search...' />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {filterList.length > 0 && Object.keys(filterList[0]).map((f, i) => {
                    return <span key={i}>
                        <input type='checkbox' value={columnHide.includes[f]} onChange={(e) => handleHideColumn(e, f)} />
                        {f}
                    </span>
                })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <table style={{ padding: '10px', border: '1px solid', width: '700px' }}>
                    <thead>
                        <tr>
                            {filterList?.length > 0 && Object.keys(filterList[0]).filter(field => !columnHide.includes(field)).map((field, i) =>
                                <th onClick={() => handleSort(field)} style={{ padding: '5px 10px', border: '1px solid', cursor: 'pointer', backgroundColor: 'lightgray' }} key={i}>
                                    {field} {currentSortedField === field && (sortTech === "asc" ? "⬇️" : sortTech === "desc" ? "⬆️" : "")}
                                </th>
                            )}
                            <th style={{ padding: '5px 10px', border: '1px solid', backgroundColor: 'lightgray' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterList.slice(startData, endData).map(u => <tr key={u.id}>
                            {Object.keys(filterList[0]).filter(ki => !columnHide.includes(ki)).map((k, i) => (
                                <td key={i} style={{ padding: '5px 10px', border: '1px solid' }}>{u[k]}</td>
                            ))}
                            <td style={{ padding: '5px 10px', border: '1px solid' }}>
                                <span style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    {/* <button>Edit</button> */}
                                    <button onClick={() => handleDelete(u.id)}>Delete</button>
                                </span>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
            <div style={{marginTop:'10px', display:'flex', gap:'2px', justifyContent:'center'}}>
                <button style={{padding:'6px', cursor:'pointer'}} onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
                {([...Array(noOfTabs)].keys()).map((tab, i) => {
                    return <button style={{padding:'6px', cursor:'pointer', backgroundColor:`${currentPage === tab + 1 ? 'lightBlue' : ''}`}} key={i + 1} onClick={() => handlePageChange(tab + 1)}>{tab + 1}</button>
                })}
                <button style={{padding:'6px', cursor:'pointer'}} onClick={handleNext} disabled={currentPage === (noOfTabs)}>Next</button>
            </div>
        </div>
    )
}

export default PracticeDataGrid