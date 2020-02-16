import React, { Component } from 'react';
import {TouchableOpacity, View, Image, StyleSheet, Dimensions} from 'react-native';
import styled from "styled-components/native"; // 3.1.6
import Carousel, {Pagination} from 'react-native-snap-carousel'; // 3.6.0
import Lightbox from 'react-native-lightbox';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Images } from '../Theme';

const {width, height} = Dimensions.get('window')
// import { iOSColors } from 'react-native-typography';

class CustomCarousel extends Component {

  constructor(props){
    super();
    this.state = {
      errors: [],
      activeSlide: 0,
    }
    this.props = props;
    this._carousel = {};
  }

  handleSnapToItem(index){
    // console.log("snapped to ", index);
    this.setState({ activeSlide: index });
  }

  renderCloseHeader = (close) => (
    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', margin: 10}} onPress={close}>
      <Icon name={'close'} size={30} color={'#fff'}/>
    </TouchableOpacity>
  )

  _renderItem = ( {item, index} ) => {
    // console.log("rendering,", index, item)
    return (
      
        this.props.noLightbox ?
        <TouchableOpacity 
        onPress={ () => { 
          // console.log("clicked to index", index)
          this._carousel.snapToItem(index);
        }}
        onLongPress={this.props.onLongPress}
        style={[styles.thumbnailBackgroundView, !this.props.biggerImage ? {alignItems: 'center', justifyContent: 'center'} : null]}
        >
          <Image source={{ uri: item }} style={styles.image}/>
          <View style={styles.paginationContainer}>
            {this.pagination}
          </View>
        </TouchableOpacity>
        :
        <TouchableOpacity 
        style={[styles.thumbnailBackgroundView, !this.props.biggerImage ? {alignItems: 'center', justifyContent: 'center'} : null]}
        onPress={ () => { 
          // console.log("clicked to index", index)
          this._carousel.snapToItem(index);
        }}
        
        >
          
            
            <Lightbox 
            springConfig={{tension: 30, friction: 7}}
            renderHeader={this.renderCloseHeader}
            >
              <Image source={{ uri: item }} style={styles.image}/>
            </Lightbox>
            

            <View style={styles.paginationContainer}>
            {this.pagination}
            </View>

          
            
          
            {/*<NextVideoImage source={{ uri: this.state.currentVideo.nextVideoId }}/>*/}
        </TouchableOpacity>
            
        
        
       

        

        
    );
  }

  get pagination () {
    const { activeSlide } = this.state;
    const {data, biggerImage} = this.props;
    return (
        <Pagination
          carouselRef={this._carousel}
          tappableDots={true}
          dotsLength={data.length}
          activeDotIndex={activeSlide}
          containerStyle={{ backgroundColor: 'transparent', width }}
          dotStyle={biggerImage? 
            {backgroundColor: Colors.black, height: 16, width: 16, borderRadius: 8}
            :
            {backgroundColor: Colors.green}
            }
          inactiveDotStyle={{
              backgroundColor: "#fff"
              // Define styles for inactive dots here
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={!biggerImage ? 0.6 : 0.65}
        />
    );
}

// <TouchableBackground onPress={this.props.onPress}>

  render = () => {
    const { data, biggerImage } = this.props;
    

    // console.log("videos: updating")

    if(data == "nothing here") {
      return (
        <CarouselContainer>
          <Image 
            source={Images.nothingHere}
            style={{width: 130, height: 130, borderRadius: 0}}
          />
        </CarouselContainer>
      

    );
  }

  else {
    return (
      <Carousel
        ref={ (c) => { this._carousel = c; } }
        data={data}
        renderItem={this._renderItem.bind(this)}
        onSnapToItem={this.handleSnapToItem.bind(this)}
        sliderWidth={500}
        itemWidth={500}
        layout={'default'}
        firstItem={0}
      /> 
    )
  }
  }
}

CustomCarousel.defaultProps = {
  biggerImage: false,
  noLightbox: false,
};

export default CustomCarousel;

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 250,
  },
  image: {
    width: width,
    height: 0.55*height,
    // borderWidth: 2,
    // borderColor: "#2c2d2d",
    // position: 'absolute'
  },

  thumbnailBackgroundView: {
    flex: 1,
    width: "100%",
  },

  paginationContainer: {
    alignItems: 'center',justifyContent: 'center',
    bottom: 0,position: "absolute", 
    
  }
})


const VideoTitleText = styled.Text`
  color: white;
  top: 28;
  justify-content: center;
`
const CarouselContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
  position: relative;
  ${'' /* background-color: blue */}
  ${'' /* width: 90%;  */}
  ${'' /* position: relative; */}
`;



// const ThumbnailBackgroundView = styled.TouchableOpacity`
//   ${'' /* justify-content: center; */}
//   ${'' /* align-items: center; */}
//   flex: 1;
//   width: 100%;
//   position: relative;
//   ${'' /* background-color: blue */}
//   ${'' /* width: 90%;  */}
//   ${'' /* position: relative; */}
// `;

const CurrentVideoTO = styled.View`
  justify-content: center;
  align-items: center;
  position: relative;
`

const CurrentVideoImage = styled.Image`
  ${'' /* top: 5; */}
  ${'' /* box-shadow: 5px 10px; */}
  width: 100%;
  height: 190;
  border-radius: 0;
  border-width: 2;
  border-color: #2c2d2d;
`;

const CarouselBackgroundView = styled.View`
  background-color: #fff;
  height: 200;
  width: 100%;
`

const TouchableBackground = styled.TouchableOpacity`
  background-color: #fff;
  ${'' /* height: 200; */}
  width: 100%;
`
// #156820