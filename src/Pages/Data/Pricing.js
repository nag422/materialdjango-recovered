import React from 'react'
import axios from 'axios';
import '../../assets/css/pricing.css'
import { NavLink } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
const Pricing = () => {
const [pricedetails,setPricedetails] = React.useState([]);
const [isloading,setIsloading]=React.useState(false)
const [tier,setTier] = React.useState(1)

const fetchpayment = async () => {
    setIsloading(true)
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    try {
        await axios.get('https://app.kiranvoleti.com/paymentrates/', config).then(res=>{
            setPricedetails(res.data.response)
            setIsloading(false)
            if(localStorage.getItem('tier') !== ""){
                setTier(localStorage.getItem('tier'))
             }
        })

    } catch (err) {
        console.log(err)
        setIsloading(false)
       
    }
}

React.useEffect(() => {
 
  fetchpayment();
}, [])

   
    return (
<>
{isloading && <LinearProgress color="secondary" />}

        <header className="headerstyle">
        <NavLink to='/profile'><button className="backbutton">&larr;Home</button></NavLink>
        </header>
        <div className="root">
        <div className="pricing-table">            
         

        {pricedetails.map((val,index)=>{
            return  <div className="pricing-card" key={val.id}>
            <h3 className="pricing-card-header">Tier{index+1}</h3>
            <div className="price"><sup>&#8377;</sup>{val.price}<span>{+val.validity * 30  >= 360 ? '/Yr':'/Mo' }</span></div>
            <ul>
            <li><strong>{val.services}</strong></li>
            <li><strong>{+val.validity * 30  >= 360 ? '1/Year':val.validity+'/Months' }</strong></li>
            </ul>
            {tier === val.tier ? <button className="order-btn">Current Plan</button>:
            val.tier === '1' && +tier > 1 ?
            null:<NavLink to={{
                pathname: "/checkout",
                search: `?tier=${val.tier}&inr=${val.price}`,
            }} className="order-btn">Order Now</NavLink>
            }
        </div>
        }
        
        
        )}

            
             {/* <div className="pricing-card">
                <h3 className="pricing-card-header">Tier2</h3>
                <div className="price"><sup>$</sup>{pricedetails.tier1.price}<span>/Yr</span></div>
                <ul>
                <li><strong>{pricedetails.tier2.services}</strong></li>
                <li><strong>{pricedetails.tier2.price} Year</strong></li>
                </ul>
                
                <NavLink to={{
                        pathname: "/checkout",
                        search: "?tier=2",
                    }} className="order-btn">Order Now</NavLink>
            </div> */}
            {/*<div className="pricing-card">
                <h3 className="pricing-card-header">Tier3</h3>
                <div className="price"><sup>$</sup>{pricedetails.tier3.price}<span>/Yr</span></div>
                <ul>
                <li><strong>{pricedetails.tier3.services}</strong></li>
                <li><strong>{pricedetails.tier3.price} Year</strong></li>
                </ul>
                <NavLink to={{
                        pathname: "/checkout",
                        search: "?tier=3",
                    }} className="order-btn">Order Now</NavLink>
                
            </div>  */}

            </div>
            </div>
            </>
    )
}

export default Pricing
