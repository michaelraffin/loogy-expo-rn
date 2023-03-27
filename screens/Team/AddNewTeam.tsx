import React, { useEffect, useState, PureComponent, useRef, useContext } from 'react';
import {
	Alert,
	Modal,
	SectionList,
	Switch,
	ToastAndroid,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	Image,
	ImageBackground,
	RefreshControl,
	Dimensions,
	TouchableOpacity,
	KeyboardAvoidingView,
	View,
	ActivityIndicator,
	Platform,
	Keyboard
} from 'react-native';
import { ApplicationProvider, Text, Layout, Button, Divider, Input, Toggle } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Clipboard from 'expo-clipboard';
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default function Dashboard({ route, navigation }) {
return <View style={{height:height,width:width,backgroundColor:'red'}}/>
}