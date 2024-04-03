import load from '../images/load.gif'

const Loader = () => {
  return (
    <div className='loader'>
      <div className="loader__image">
        <img src={load} alt="" />
      </div>
    </div>
  )
}
export default Loader