import { useTranslation } from "react-i18next";
import LoadMore from "../../component/shop/loadMore/LoadMore";
import ShopHeader from "../../component/shop/shopHeader/ShopHeader";
import ShopList from "../../component/shop/shopList/ShopList";
const Shop = () => 
{
    const { t } = useTranslation('common');
    const data = {
        address: "alamat",
        open_day: 'Senin',
        close_day: 'Jumat',
        open_hour: '00:00',
        close_hour: '00:00',
        latitude: '123',
        longitude: '123'
    }
    
    return (
        <div>
            <ShopHeader headerTitle={t('shop_list.shop_list')}/>
            <div className="container-fluid px-lg-5 shop">
                <div className="row px-lg-3">
                    <div className="col-lg-6 mb-lg-5 mb-4">
                        <ShopList 
                            data={ data }
                            name="Arjuna Elektronik"
                            range="2.3"
                            address="lorep ipsum lorep ipsum lorep ipsum lorep ipsum lorep ipsum lorep ipsum"
                        />
                    </div>

                    <LoadMore />
                </div>
            </div>
        </div>
    );
}

export default Shop;