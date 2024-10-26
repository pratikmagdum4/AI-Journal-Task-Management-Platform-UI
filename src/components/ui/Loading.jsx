import Navbar from '../../pages/Navbar/Navbar';
import '../styles/loading.css';

const Loading = ({ links, isHome }) => {

    return (
        <>
            {isHome ? (
                <>
                    <div className='loader mt-14'>
                        Loading
                        <span></span>
                    </div>
                </>) :
                (<> 
                    <div className='loader'>
                        Loading
                        <span></span>
                    </div></>
                )}

        </>
    )
}

export default Loading;