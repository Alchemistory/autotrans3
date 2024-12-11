"use client";
import React, { useEffect,useState } from "react";
import { Radio, RadioGroup, Tooltip } from "@nextui-org/react";
function RadioGroupComplete({ characters, setCharacters, selectedListbox, setSelectedListbox, selectedSelect, setSelectedSelect,mappingSpeakerCharacter, setMappingSpeakerCharacter }) {
  const [selectedRadio, setSelectedRadio] = useState(null);

  // 라디오 선택이 변경될 때마다 실행되는 useEffect
  useEffect(() => {
    const defaultCharacter = mappingSpeakerCharacter?.find(
      (item) => item.speaker === selectedListbox
    )?.character;
    console.log('defaultCharacter:',defaultCharacter)
    setSelectedRadio(defaultCharacter?.title1 || "");
  }, [selectedListbox, mappingSpeakerCharacter]);
  
  const handleMappingSpeakerCharacter = (value) => {
    // 현재 선택된 speaker에 대한 매핑 정보가 있는지 확인
    const existingIndex = mappingSpeakerCharacter.findIndex(
      (item) => item.speaker === selectedListbox
    );

    // 선택된 캐릭터 찾기
    const selectedCharacter = characters.find(char => char.title1 === value);
    // 필요한 속성만 추출
    const characterInfo = {
      description: selectedCharacter.description,
      title1: selectedCharacter.title1,
      title2: selectedCharacter.title2
    };

    if (existingIndex !== -1) {
      // 기존 매핑이 있다면 업데이트
      const updatedMapping = [...mappingSpeakerCharacter];
      updatedMapping[existingIndex] = {
        ...updatedMapping[existingIndex],
        character: characterInfo,
        status: updatedMapping[existingIndex].status === 'none' ? 'done' : updatedMapping[existingIndex].status
      };
      setMappingSpeakerCharacter(updatedMapping);
    } else {
      // 새로운 매핑 추가
      setMappingSpeakerCharacter([
        ...mappingSpeakerCharacter,
        {
          speaker: selectedListbox,
          character: characterInfo,
          status: 'done'
        }
      ]);
    }
  };
  console.log('mappingSpeakerCharacter:',mappingSpeakerCharacter)

  return (
    <RadioGroup
      value={selectedRadio}
      onValueChange={(value) => {
        setSelectedRadio(value);
        handleMappingSpeakerCharacter(value);
      }}
      defaultValue='멋쟁이'
    >
      {characters.map((character, index) => (
        <Radio key={index} value={character.title1}>
          <div className=" gap-x-2 justify-between items-center grid grid-cols-12">
            <Tooltip
              placement="top-start"
              content={
                <p
                  className="text-xs text-gray-500"
                  style={{
                    maxWidth: "60ch",
                    wordWrap: "break-word",
                  }}
                >
                  {character.title2}
                </p>
              }
            >
              <p className="text-sm font-bold col-span-12 md:col-span-2">
                {character.title1}
              </p>
            </Tooltip>
            <Tooltip
              placement="top-start"
              content={
                <p
                  className="text-xs text-gray-500"
                  style={{
                    maxWidth: "60ch",
                    wordWrap: "break-word",
                  }}
                >
                  {character.description}
                </p>
              }
            >
              <p className="text-xs text-gray-500 col-span-10 truncate flex">
                {character.description}
              </p>
            </Tooltip>
          </div>
        </Radio>
      ))}
    </RadioGroup>
  );
}

export default RadioGroupComplete;
