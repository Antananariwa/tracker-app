import React from 'react'
import './ContainerMaincontent.css'
import BoxMainContent from './BoxMainContent'

const ContainerMainContent = () => {
  return (
    <div className="ConainerMainContentDiv">
      <BoxMainContent
        title = "Where can I get some?"
        textInput = "Donec ullamcorper hendrerit semper. Morbi ut bibendum ligula, et sagittis sem. Aliquam vitae vulputate nisi. Curabitur id mattis augue. Suspendisse scelerisque nunc massa. Donec aliquet purus vel sapien porttitor, non dictum augue pulvinar. Sed ante erat, bibendum vitae nisi et, tincidunt vulputate nisi. Aenean congue ultricies gravida. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lobortis tincidunt lacus a commodo. Vivamus in accumsan metus. Aenean facilisis neque quis erat consequat, eget suscipit nulla maximus. "
      />
      <BoxMainContent
        title = "Why do we live?"
        textInput = "Pellentesque non faucibus nisl. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean mattis sapien nec lectus lacinia imperdiet quis eget velit. Sed sit amet arcu ut turpis sodales condimentum. Proin posuere eros metus, ut eleifend risus tempus sit amet. Nulla nec ex ullamcorper, luctus diam nec, iaculis diam. Maecenas nec orci at magna sodales pharetra pellentesque ac sem. Ut dolor enim, consectetur vitae enim eget, malesuada accumsan massa. Morbi justo nibh, scelerisque vitae sodales ac, rutrum vitae velit. Suspendisse lorem ex, lacinia non luctus quis, dictum ac sapien. Vestibulum feugiat lobortis enim nec aliquet. In a cursus leo. Curabitur at euismod nisi. Sed euismod augue eros, non porta nunc congue non. Suspendisse et eros ligula. "
      />
      <BoxMainContent
        title = "Cool title trust no cap?"
        textInput = " Donec id sollicitudin leo. Pellentesque ac vehicula libero, interdum iaculis augue. Nullam eget elit sit amet erat placerat pulvinar. Curabitur tincidunt felis vitae dolor dignissim ornare. Curabitur et dapibus ante, ac facilisis ligula. Pellentesque sit amet eleifend purus, id tincidunt erat. Nam aliquam felis metus, vel volutpat elit lobortis id. Nunc iaculis condimentum diam quis dictum. Vivamus massa eros, tincidunt eu egestas ullamcorper, volutpat vel augue. Nullam id ornare eros, in imperdiet odio. Etiam sit amet imperdiet orci. Donec non convallis nulla. Nunc congue scelerisque tristique. Vivamus ut tristique velit, vestibulum suscipit nulla. Vestibulum venenatis tellus nec quam tempus tempus. Etiam dignissim, mauris non molestie efficitur, tellus arcu pellentesque diam, sed rhoncus mi ligula vel dui. "
      />
      <BoxMainContent
        title = "Sun is my Moon?"
        textInput = " Sed blandit libero vel urna hendrerit sollicitudin. Nullam nec orci eu diam egestas interdum. Curabitur mattis finibus lectus sed ultrices. Fusce sollicitudin lobortis placerat. Integer mollis est nec ex luctus facilisis. Phasellus iaculis, lectus non dignissim blandit, turpis risus rutrum justo, bibendum interdum arcu lorem vel magna. Aliquam porta nec augue in scelerisque. In eget varius ipsum, sit amet fermentum magna. Ut luctus nulla sit amet laoreet suscipit. "
      />
    </div>
  )
}

export default ContainerMainContent
