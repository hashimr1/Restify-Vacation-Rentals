import './index.css'
function Amenities({value, name}){

 
    return <>
        <li>
            <div class="form-check">
                <input class="form-check-input" type="checkbox"  name={name} onChange={value} value="" id="flexCheckIndeterminate"/>
            </div>
              {name}
        </li>
    </>
}

export default Amenities