import {useEffect} from 'react';
import notifee, {AndroidImportance, AndroidStyle} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

const Notification = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onDisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);

  const onDisplayNotification = async data => {
    console.log('response', data.notification);
    let resp = data.notification;

    const channelId = await notifee.createChannel({
      id: 'default6',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
      vibrationPattern: [300, 500],
    });

    await notifee.displayNotification({
      title: resp?.title,
      body: resp?.body,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
        smallIcon: 'ic_launcher',
        largeIcon: 'ic_launcher',
        // style: {
        //   type: AndroidStyle.BIGPICTURE,
        //   picture: data?.data.image,
        // },
      },
    });
  };
};

export default Notification;