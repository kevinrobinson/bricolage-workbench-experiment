import React, {useState, useEffect} from 'react';
import _ from 'lodash';
import {useJson} from './useJson';
import './App.css';
import Spinner from './Spinner';

const App: React.FC = () => {
  const smileExamples = useJson('data/smile_examples.json');
  const [example, setExample] = useState(null);
  const [featureKey, setFeatureKey] = useState(null);

  useEffect(() => {
    if (smileExamples !== null && example === null) {
      setExample(smileExamples[0]);
    }
  }, [smileExamples]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="Smiles">
          {example && 
            <Smile
              example={example!}
              onFeatureClicked={setFeatureKey}
            />
          }
          {!example && <Spinner style={{margin: 20}} />}
        </div>
        <div className="Explore">
          <h1>{featureKey ? featureKey : '(none)'}</h1>
          <button>resample</button>
          {smileExamples && featureKey && 
            <Explore
              featureKey={featureKey!}
              smileExamples={smileExamples}
              onExampleClicked={setExample}
            />
          }
        </div>
      </header>
    </div>
  );
}

export default App;


const Explore: React.FC<ExploreProps> = ({smileExamples, onExampleClicked, featureKey}) => {
  const examples = smileExamples; //.slice(0, n);
  const examplesByValue = _.groupBy(examples, example => {
    const bytes = example.features.feature[featureKey].bytesList.value[0];
    const text = atob(bytes);
    return text;
  });
  return (
    <div>
      {Object.keys(examplesByValue).map(featureValue => {

        return (
          <div key={featureValue}>
            <h2>{featureValue}, {examplesByValue[featureValue].length}</h2>
            {(examplesByValue[featureValue] || []).map((example, index) => {
              const imgUri = readImgUri(example)
              return (
                <div
                  key={index} 
                  className="Explore-thumbnail"
                  onClick={e => {
                    e.preventDefault();
                    onExampleClicked(example);
                  }}>
                  <img src={imgUri} width={64} height={64} alt="img" />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
interface ExploreProps {
  smileExamples: [Example],
  featureKey: keyof FeatureBag,
  onExampleClicked: ((e:any) => void) // TODO
}




interface Example {
  features: {
    feature: FeatureBag
  }
}
interface FeatureBag {
  "Sideburns": Feature,
  "Black_Hair": Feature,
  "Wavy_Hair": Feature,
  "Young": Feature,
  "Blond_Hair": Feature,
  "5_o_Clock_Shadow": Feature,
  "Wearing_Necktie": Feature,
  "Blurry": Feature,
  "Brown_Hair": Feature,
  "Mouth_Slightly_Open": Feature,
  "Goatee": Feature,
  "Bald": Feature,
  "Gray_Hair": Feature,
  "Pale_Skin": Feature,
  "Arched_Eyebrows": Feature,
  "Wearing_Hat": Feature,
  "Straight_Hair": Feature,
  "Oval_Face": Feature,
  "Bangs": Feature,
  "Male": Feature,
  "Mustache": Feature,
  "High_Cheekbones": Feature,
  "No_Beard": Feature,
  "Eyeglasses": Feature,
  "Bags_Under_Eyes": Feature,
  "Wearing_Necklace": Feature,
  "Wearing_Lipstick": Feature,
  "Narrow_Eyes": Feature,
  "Bushy_Eyebrows": Feature,
  "Wearing_Earrings": Feature,
  "image/encoded": Feature
}
interface Feature {
  "bytesList": {
    "value": [string]
  }
}




const Smile: React.FC<SmileProps> = ({example, onFeatureClicked}) => {
  function show(featureKey:keyof FeatureBag) {
    const bytes = example.features.feature[featureKey].bytesList.value[0];
    const text = atob(bytes);
    const bold = !(
      text.indexOf('Not ') === 0 ||
      text.indexOf('No ') === 0 ||
      text.indexOf(' not ') !== -1 ||
      text.indexOf(' no ') !== -1
    );
    return (
      <div>
        <a className="FeatureKey" href="#" onClick={e => {
          e.preventDefault();
          onFeatureClicked(featureKey);
        }}>
          {bold ? <b>{text}</b> : <span style={{color: '#999'}}>{text}</span>}
        </a>
      </div>
    );
  }

  const imgUri = readImgUri(example);
  const backgroundColor = 'white'; // rgb(252, 234, 43)';
  return (
    <div className="Smile" style={{backgroundColor}}>
      <img src={imgUri} width={256} height={256} alt="img" />
      <div className="Panel">
        {show("Black_Hair")}
        {show("Blond_Hair")}
        {show("Brown_Hair")}
        {show("Gray_Hair")}
        {show("Bald")}
        {show("Straight_Hair")}
        {show("Wavy_Hair")}
        {show("Bangs")}
        {show("Sideburns")}
      </div>

      <div className="Panel">
        {show("Blurry")}
      </div>

      <div className="Panel">
        {show("Young")}
        {show("Male")}
      </div>

      <div className="Panel">
        {show("5_o_Clock_Shadow")}
        {show("Goatee")}
        {show("Mustache")}
        {show("No_Beard")}
      </div>

      <div className="Panel">
        {show("Wearing_Necktie")}
        {show("Wearing_Hat")}
        {show("Eyeglasses")}
        {show("Wearing_Necklace")}
        {show("Wearing_Lipstick")}
        {show("Wearing_Earrings")}
      </div>

      <div className="Panel">
        {show("Mouth_Slightly_Open")}
        {show("Arched_Eyebrows")}
      </div>
      
      <div className="Panel">
        {show("Bushy_Eyebrows")}
        {show("Pale_Skin")}
        {show("Narrow_Eyes")}
        {show("Oval_Face")}
        {show("High_Cheekbones")}
        {show("Bags_Under_Eyes")}
      </div>
    </div>
  );
}
interface SmileProps {
  example: Example,
  onFeatureClicked: ((e:any) => void)
}


function readImgUri(example:Example) {
  const imgBytes = example.features.feature['image/encoded'].bytesList.value[0];
  return `data:image/png;base64,${imgBytes}`;
}