import MainContentBox from "../../MainContentBox"


const CryptoBrowsePage = () => {
  return (
    <div>
      <MainContentBox>
        <CryptoSearchBar />
      </MainContentBox>

      <MainContentBox>
        <PrimaryGraph />
      </MainContentBox>
    </div>
  )
}

export default CryptoBrowsePage
