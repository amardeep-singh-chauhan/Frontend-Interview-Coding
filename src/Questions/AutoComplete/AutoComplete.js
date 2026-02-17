import React, { useEffect, useState } from 'react'
import countryList from './countryList.json'
import './autoComp.css'

const AutoComplete = () => {
    const [country, setCountry] = useState('')
    const [autoCountry, setAutoCountry] = useState([])

    useEffect(() => {
        if (country !== "") {
            const searched = countryList.filter(({name}) => name.toLowerCase().includes(country.toLowerCase())
            );
            setAutoCountry(searched);
        } else {
            setAutoCountry(countryList);
        }
    }, [country])

    const handleCountryChange = (e) => {
        setCountry(e.target.value)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center", gap: '1rem', padding: '1rem' }}>
            <div>AutoComplete</div>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '1rem', border: '1px solid' }}>

                <input value={country} onChange={(e) => handleCountryChange(e)} />
                <div style={{ height: '250px', overflow: 'auto' }}>
                    {autoCountry.length > 0 && autoCountry.map((con) => {
                        return <div className={`country-list-item ${con.name === country ? 'selected-country-item' : ''}`}  key={con.code} onClick={() => setCountry(con.name)}>{con.name}</div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default AutoComplete