import {Dimensions, StatusBar} from 'react-native';

export const bottombarHeight =
  Dimensions.get('screen').height == Dimensions.get('window').height
    ? Dimensions.get('screen').height -
      Dimensions.get('window').height +
      StatusBar.currentHeight
    : StatusBar.currentHeight;

export const Colors = {
  //UI Neutrals

  // background
  Orange: '#FF5722',
  OrangeLight: '#F99145',
  White: '#FFFFFF',
  Black: '#000000',
  Text: '#0A212B',
  grayText: '#999999',
  borderGray: '#EAE9E9'
};
export const Fonts = {
  PlusJakartaSans_Bold: 'PlusJakartaSans-Bold',
  PlusJakartaSans_BoldItalic: 'PlusJakartaSans-BoldItalic',
  PlusJakartaSans_ExtraBold: 'PlusJakartaSans-ExtraBold',
  PlusJakartaSans_ExtraBoldItalic: 'PlusJakartaSans-ExtraBoldItalic',
  PlusJakartaSans_ExtraLight: 'PlusJakartaSans-ExtraLight',
  PlusJakartaSans_ExtraLightItalic: 'PlusJakartaSans-ExtraLightItalic',
  PlusJakartaSans_Italic: 'PlusJakartaSans-Italic',
  PlusJakartaSans_Light: 'PlusJakartaSans-Light',
  PlusJakartaSans_LightItalic: 'PlusJakartaSans-LightItalic',
  PlusJakartaSans_Medium: 'PlusJakartaSans-Medium',
  PlusJakartaSans_MediumItalic: 'PlusJakartaSans-MediumItalic',
  PlusJakartaSans_Regular: 'PlusJakartaSans-Regular',
  PlusJakartaSans_SemiBold: 'PlusJakartaSans-SemiBold',
  PlusJakartaSans_SemiBoldItalic: 'PlusJakartaSans-SemiBoldItalic',
  //Inter Fonts
  Inter_Black: 'Inter-Black',
  Inter_Bold: 'Inter-Bold',
  Inter_ExtraBold: 'Inter-ExtraBold',
  Inter_ExtraLight: 'Inter-ExtraLight',
  Inter_Light: 'Inter-Light',
  Inter_Medium: 'Inter-Medium',
  Inter_Regular: 'Inter-Regular',
  Inter_SemiBold: 'Inter-SemiBold',
  Inter_Thin: 'Inter-Thin',
};

export const Images = {
  onboardingLogo: require('../Assets/png/Auth/onboardingLogo.png'),
  authBG: require('../Assets/png/Auth/authBG.png'),
  google: require('../Assets/png/Auth/google.png'),
  facebook: require('../Assets/png/Auth/facebook.png'),

  logo: require('../Assets/png/Dashboard/logo.png'),
  food1: require('../Assets/png/Dashboard/food1.png'),
  food2: require('../Assets/png/Dashboard/food2.png'),
  food3: require('../Assets/png/Dashboard/food3.png'),
  food4: require('../Assets/png/Dashboard/food4.png'),
  food5: require('../Assets/png/Dashboard/food5.png'),
  food6: require('../Assets/png/Dashboard/food6.png'),
  food7: require('../Assets/png/Dashboard/food7.png'),
  food8: require('../Assets/png/Dashboard/food8.png'),
  burger: require('../Assets/png/Dashboard/burger.png'),
  salad: require('../Assets/png/Dashboard/salad.png'),

  chinese: require('../Assets/png/Dashboard/chinese.png'),
  shake: require('../Assets/png/Dashboard/shake.png'),
  biryani: require('../Assets/png/Dashboard/biryani.png'),
  pasta: require('../Assets/png/Dashboard/pasta.png'),

  restaurant: require('../Assets/png/Dashboard/res1.png'),
  restaurant1: require('../Assets/png/Dashboard/restaurant1.png'),
  restaurant2: require('../Assets/png/Dashboard/restaurant2.png'),
  restaurant3: require('../Assets/png/Dashboard/restaurant3.png'),
  restaurant4: require('../Assets/png/Dashboard/restaurant4.png'),
  user1: require('../Assets/png/Dashboard/user1.png'),
  user2: require('../Assets/png/Dashboard/user2.png'),
  user3: require('../Assets/png/Dashboard/user3.png'),
  user4: require('../Assets/png/Dashboard/user4.png'),
  user5: require('../Assets/png/Dashboard/user5.png'),
  user6: require('../Assets/png/Dashboard/user6.png'),
  user7: require('../Assets/png/Dashboard/user7.png'),

  master_card: require('../Assets/png/Dashboard/master_card.png'),

  //other
  success_check: require('../Assets/other/success_check.json'),
};

// import SearchIcon from '../Assets/svg/search.svg';
// import SearchIconInActive from '../Assets/svg/searchInactive.svg';
// import Heart from '../Assets/svg/heart.svg';
// import HeartActive from '../Assets/svg/heartActive.svg';
// import Bike from '../Assets/svg/bike.svg';
// import Checkout from '../Assets/svg/checkout.svg';
// import Rating from '../Assets/svg/rating.svg';
// import Marker from '../Assets/svg/marker.svg';
// import MapPin from '../Assets/svg/map_pin.svg';
// import Van from '../Assets/svg/Van.svg';
// import Location from '../Assets/svg/Location.svg';
// import ChatActive from '../Assets/svg/chatActive.svg';
// import AddFilled from '../Assets/svg/add.svg';
// import AddActive from '../Assets/svg/addActive.svg';
// import Delete from '../Assets/svg/delete.svg';
// import Remove from '../Assets/svg/remove.svg';
// import Edit from '../Assets/svg/edit.svg';
// import Phone from '../Assets/svg/phone.svg';

// import OrderInProcess from '../Assets/svg/order_in_process.svg';
// import OrderOutForDelivery from '../Assets/svg/order_out_for_delivery.svg';
// import OrderPlaced from '../Assets/svg/order_placed.svg';
// import WalletActive from '../Assets/svg/walletActive.svg';
// import MapMarker from '../Assets/svg/mapMarker.svg';
// import Send from '../Assets/svg/send.svg';
// import DoubleTick from '../Assets/svg/double_tick.svg';
// import LogoutActive from '../Assets/svg/logoutActive.svg';
// import Facebook from '../Assets/svg/Facebook.svg';
// export const Icons = {
//   SearchIcon,
//   SearchIconInActive,
//   Heart,
//   HeartActive,
//   Bike,
//   Checkout,
//   Rating,
//   Marker,
//   MapPin,
//   Van,
//   Location,
//   ChatActive,
//   AddFilled,
//   AddActive,
//   Delete,
//   Remove,
//   Edit,
//   Phone,
//   OrderInProcess,
//   OrderOutForDelivery,
//   OrderPlaced,
//   WalletActive,
//   MapMarker,
//   Send,
//   DoubleTick,
//   LogoutActive,
//   Facebook,
// };

import SearchIcon from '../Assets/svg/search.svg';
import SearchIconInActive from '../Assets/svg/searchInactive.svg';
import Heart from '../Assets/svg/heart.svg';
import HeartActive from '../Assets/svg/heartActive.svg';
import Bike from '../Assets/svg/bike.svg';
import Checkout from '../Assets/svg/checkout.svg';
import Rating from '../Assets/svg/rating.svg';
import RatingActive from '../Assets/svg/ratingActive.svg';
import Marker from '../Assets/svg/marker.svg';
import MapPin from '../Assets/svg/map_pin.svg';
import MapPinActive from '../Assets/svg/MapPinActive.svg';
import Van from '../Assets/svg/Van.svg';
import Location from '../Assets/svg/Location.svg';
import ChatActive from '../Assets/svg/chatActive.svg';
import ChatWhite from '../Assets/svg/ChatWhite.svg';
import AddFilled from '../Assets/svg/add.svg';
import AddActive from '../Assets/svg/addActive.svg';
import Delete from '../Assets/svg/delete.svg';
import Remove from '../Assets/svg/remove.svg';
import Edit from '../Assets/svg/edit.svg';
import Phone from '../Assets/svg/phone.svg';

import OrderInProcess from '../Assets/svg/order_in_process.svg';
import OrderOutForDelivery from '../Assets/svg/order_out_for_delivery.svg';
import OrderPlaced from '../Assets/svg/order_placed.svg';
import WalletActive from '../Assets/svg/walletActive.svg';
import Wallet from '../Assets/svg/wallet.svg';
import MapMarker from '../Assets/svg/mapMarker.svg';
import Send from '../Assets/svg/send.svg';
import DoubleTick from '../Assets/svg/double_tick.svg';
import LogoutActive from '../Assets/svg/logoutActive.svg';
//auth icons
import Email from '../Assets/svg/email.svg';
import AddImage from '../Assets/svg/addImage.svg';
import UploadFile from '../Assets/svg/uploadFile.svg';

import Dollar from '../Assets/svg/dollar.svg';
import Complaints from '../Assets/svg/complaints.svg';

import Settings from '../Assets/svg/settings.svg';
import Notification from '../Assets/svg/notification.svg';
import SearchDashboard from '../Assets/svg/searchDashboard.svg';
import StartDashboard from '../Assets/svg/starDashboard.svg';
import AddButton from '../Assets/svg/addButton.svg';
import AddSquare from '../Assets/svg/addsquare.svg';
import AddSquareActive from '../Assets/svg/addsquareactive.svg';
import DeleteActive from '../Assets/svg/deleteActive.svg';
import EditActive from '../Assets/svg/editActive.svg';
import EditSquare from '../Assets/svg/editSquare.svg';
import PhoneOutlineActive from '../Assets/svg/phoneOutlineActive.svg';
import MarkerOutlineActive from '../Assets/svg/markerOutlineActive.svg';
import WalletActiveBackground from '../Assets/svg/WalletActiveBackground.svg';
import Profile from '../Assets/svg/profile.svg';
import ProfileActive from '../Assets/svg/profileActive.svg';
import DashboardBG from '../Assets/svg/dashboardBG.svg';
import Menu from '../Assets/svg/menu.svg';
import Calender from '../Assets/svg/calender.svg';
import orderPlaced from '../Assets/svg/orderPlaced.svg';
import orderPlacedInactive from '../Assets/svg/orderPlacedInactive.svg';
import orderDelivery from '../Assets/svg/orderDelivery.svg';
import orderDeliveryWhite from '../Assets/svg/orderDeliveryWhite.svg';
import orderPreparing from '../Assets/svg/orderPreparing.svg';
import Lock from '../Assets/svg/lock.svg';
import Check from '../Assets/svg/check.svg';
import CheckCircle from '../Assets/svg/checkCircle.svg';
import UncheckCircle from '../Assets/svg/uncheckCircle.svg';

import Refresh from '../Assets/svg/refresh.svg';

//

import AuthLogo from '../Assets/svg/authLogo.svg';
import Google from '../Assets/svg/Google.svg';
import Facebook from '../Assets/svg/Facebook.svg';
import Next from '../Assets/svg/next.svg';
import EditWhite from '../Assets/svg/editWhite.svg';
import DeleteWhite from '../Assets/svg/deleteWhite.svg';
import UploadImage from '../Assets/svg/uploadImage.svg';
import SearchWhite from '../Assets/svg/SearchWhite.svg';
import Profile1 from '../Assets/svg/profile1.svg';
import MenuActive from '../Assets/svg/menuActive.svg';
import NotificationActive from '../Assets/svg/notificationActive.svg';
import NotificationWithDot from '../Assets/svg/notificationWithDot.svg';

import DiscoverActive from '../Assets/svg/discoverActive.svg';
import Discover from '../Assets/svg/discover.svg';
import Order from '../Assets/svg/orders.svg';
import OrdersActive from '../Assets/svg/ordersActive.svg';
import LogoutIcon from '../Assets/svg/logout.svg';

import LockBlack from '../Assets/svg/lockBlack.svg';
import EditProfile from '../Assets/svg/editProfile.svg';
import Note from '../Assets/svg/note.svg';
import CardActiveOutline from '../Assets/svg/cardActiveOutline.svg';
import AddCircle from '../Assets/svg/AddCircle.svg';
import TopSearch from '../Assets/svg/topSearch.svg';
import Close from '../Assets/svg/close.svg';
import RatingWhite from '../Assets/svg/RatingWhite.svg';
import Video from '../Assets/svg/video.svg';
import AddSimple from '../Assets/svg/addSimple.svg';
import LocationLogo from '../Assets/svg/LocationLogo.svg';

export const Icons = {
  AddSimple,
  SearchIcon,
  SearchIconInActive,
  SearchWhite,
  Heart,
  HeartActive,
  Bike,
  Checkout,
  Rating,
  RatingActive,
  Marker,
  MapPin,
  MapPinActive,
  Van,
  Location,
  ChatActive,
  ChatWhite,
  AddFilled,
  AddActive,
  Delete,
  Remove,
  Edit,
  Phone,
  OrderInProcess,
  OrderOutForDelivery,
  OrderPlaced,
  orderPlacedInactive,
  WalletActive,
  Wallet,
  MapMarker,
  Send,
  DoubleTick,
  LogoutActive,
  Email,
  AddImage,
  UploadFile,
  Complaints,
  Dollar,
  Settings,
  Notification,
  SearchDashboard,
  StartDashboard,
  AddButton,
  AddSquare,
  AddSquareActive,
  DeleteActive,
  EditActive,
  EditSquare,
  PhoneOutlineActive,
  MarkerOutlineActive,
  WalletActiveBackground,
  Profile,
  Profile1,
  ProfileActive,
  DashboardBG,
  Menu,
  Calender,
  orderPlaced,
  orderDelivery,
  orderDeliveryWhite,
  orderPreparing,
  Lock,
  Check,
  Refresh,

  AuthLogo,
  Google,
  Facebook,
  Next,
  EditWhite,
  DeleteWhite,
  UploadImage,
  MenuActive,
  NotificationActive,
  NotificationWithDot,

  Discover,
  DiscoverActive,
  Order,
  OrdersActive,
  LogoutIcon,

  EditProfile,
  Note,
  LockBlack,
  CardActiveOutline,
  AddCircle,
  TopSearch,
  Close,
  RatingWhite,
  Video,
  LocationLogo,

  CheckCircle,
  UncheckCircle,
};
