"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useBookName } from "@/store/useBookName";
import { ToastContainer, toast } from "react-toastify";
import { createClient } from "@/utils/supabase/client";
import { useChapterList } from "@/store/useChapterList";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
function ProgrssSection() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
  const pathname = usePathname();
  const { bookName } = useBookName();
  const supabase = createClient();
  const [booksId, setBooksId] = useState(null);
  const [chapterId, setChapterId] = useState(null);
  const { chapterList, setChapterList } = useChapterList();
  const [isFixed, setIsFixed] = useState(false);
  const [fixedStates, setFixedStates] = useState("");

  const fetchChapterList = async () => {
    const { data, error } = await supabase
      .from("chapterList")
      .select("*")
      .eq("booksId", booksId)
      .eq("id", chapterId)
      .single();

    if (error) {
      console.log("Error fetching chapter list:", error);
    } else {
      setChapterList(data);
      if (data?.[fixedStates]) {
        onOpen();
      }
    }
  };
  useEffect(() => {
    fetchChapterList();
  }, [booksId, chapterId]);

  useEffect(() => {
    const pathSegments = pathname.split("/");
    const chapterId = pathSegments[pathSegments.length - 1];
    const booksId = pathSegments[pathSegments.length - 2];
    setBooksId(booksId);
    setChapterId(chapterId);
  }, [pathname]);

  // Initialize a single state object

  // Update state based on pathname
  useEffect(() => {
    if (pathname.includes("speaker")) {
      setFixedStates("isFixedSpeaker");
    } else if (pathname.includes("consistency")) {
      setFixedStates("isFixedConsistency");
    } else if (pathname.includes("expression")) {
      setFixedStates("isFixedExpression");
    } else {
      setFixedStates("");
    }
  }, [pathname]);

  console.log("pathname:", pathname);

  const handleConfirm = async () => {
    const { error: error1 } = await supabase
      .from("chapterList")
      .update({ [fixedStates]: true })
      .eq("booksId", booksId)
      .eq("id", chapterId);

    const { error: error2 } = await supabase
      .from("mappingSpeakerCharacter")
      .update({ [fixedStates]: true })
      .eq("booksId", booksId)
      .eq("chapterId", chapterId);

    if (error2) {
      console.log(error2);
    } else {
      router.refresh();
      fetchChapterList();
    }
  };
  console.log("fixedStates:", fixedStates);

  const cancelConfirm = async () => {
    const { error: error1 } = await supabase
      .from("chapterList")
      .update({ [fixedStates]: false })
      .eq("booksId", booksId)
      .eq("id", chapterId);

    const { error: error2 } = await supabase
      .from("mappingSpeakerCharacter")
      .update({ [fixedStates]: false })
      .eq("booksId", booksId)
      .eq("chapterId", chapterId);

    if (error1 || error2) {
      console.log(error1, error2);
    } else {
      router.refresh();
      fetchChapterList();
    }
  };

  if (pathname.includes("expression")) {
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">알림</ModalHeader>
                <ModalBody>
                  <p>
                    현재 확정 상태로 변경 필요 시 우측 상단에 취소 버튼 클릭 후
                    수정 바랍니다.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    확인
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <div className="flex flex-row gap-4 justify-between items-center w-full px-2">
          <div>
            <h1 className="text-2xl font-bold">표현 검토</h1>
            <p className="text-gray-500 font-medium">
              <span>책이름:</span>
              {bookName?.booksId?.titleKR}
            </p>
            <p className="text-gray-500 font-medium">
              <span>챕터명:</span>
              {bookName?.titleKR}(#{bookName?.chapterNumber})
            </p>
          </div>
          <div>
            {chapterList?.isFixedExpression ? (
              <Button color="danger" onClick={cancelConfirm}>
                취소
              </Button>
            ) : (
              <Button
                isDisabled={chapterList?.isFixedExpression}
                color="danger"
                onClick={handleConfirm}
              >
                확정
              </Button>
            )}
          </div>
        </div>
      </>
    );
  } else if (pathname.includes("consistency")) {
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">알림</ModalHeader>
                <ModalBody>
                  <p>
                    현재 확정 상태로 변경 필요 시 우측 상단에 취소 버튼 클릭 후
                    수정 바랍니다.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    확인
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <div className="flex flex-row gap-4 justify-between items-center w-full px-2">
          <div>
            <h1 className="text-2xl font-bold">일관성 검토</h1>
            <p className="text-gray-500 font-medium">
              <span>책이름:</span>
              {bookName?.booksId?.titleKR}
            </p>
            <p className="text-gray-500 font-medium">
              <span>챕터명:</span>
              {bookName?.titleKR}(#{bookName?.chapterNumber})
            </p>
          </div>
          <div>
            {chapterList?.isFixedConsistency ? (
              <Button color="danger" onClick={cancelConfirm}>
                취소
              </Button>
            ) : (
              <Button
                isDisabled={chapterList?.isFixedConsistency}
                color="danger"
                onClick={handleConfirm}
              >
                확정
              </Button>
            )}
          </div>
        </div>
      </>
    );
  } else if (pathname.includes("speaker")) {
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">알림</ModalHeader>
                <ModalBody>
                  <p>
                    현재 확정 상태로 변경 필요 시 우측 상단에 취소 버튼 클릭 후
                    수정 바랍니다.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    확인
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <div className="flex flex-row gap-4 justify-between items-center w-full px-2">
          <div>
            <h1 className="text-2xl font-bold">문장유형 검토</h1>
            <p className="text-gray-500 font-medium">
              <span>책이름:</span>
              {bookName?.booksId?.titleKR}
            </p>
            <p className="text-gray-500 font-medium">
              <span>챕터:</span>#{bookName?.chapterNumber} {bookName?.titleKR}
            </p>
          </div>

          <div>
            {chapterList?.isFixedSpeaker ? (
              <Button color="danger" onClick={cancelConfirm}>
                취소
              </Button>
            ) : (
              <Button
                isDisabled={chapterList?.isFixedSpeaker}
                color="danger"
                onClick={handleConfirm}
              >
                확정
              </Button>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="flex flex-row gap-4 justify-between items-center w-full px-2">
        <div>
          <h1 className="text-2xl font-bold">홈</h1>
        </div>
      </div>
    );
  }
}

export default ProgrssSection;
