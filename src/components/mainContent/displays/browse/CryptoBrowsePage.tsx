import MainContentBox from "../../MainContentBox"
import PrimaryGraph from "../groups/PrimaryGraph"


const CryptoBrowsePage = () => {
  return (
    <div>
      <MainContentBox>
        <CryptoSearchBar />
      </MainContentBox>

      <MainContentBox>
        <PrimaryGraph />
      </MainContentBox>

      <MainContentBox>
        <Example coin info component />
      </MainContentBox>

      <MainContentBox>
        <Example coin info component />
      </MainContentBox>

    </div>
  )
}

export default CryptoBrowsePage
