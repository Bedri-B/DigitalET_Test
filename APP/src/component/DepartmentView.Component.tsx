import {
  Accordion,
  Text,
  ActionIcon,
  AccordionControlProps,
  Box,
  Button,
  Center,
  Menu,
  Stack,
  Group,
  Modal,
  LoadingOverlay,
} from "@mantine/core";
import axios from "axios";
import { Department } from "../model/Department.model";
import { showNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconDots,
  IconEdit,
  IconPlus,
  IconRefresh,
  IconTrash,
  IconX,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/app.store";
import { DepartmentFormComponent } from "./DepartmentForm.Component";

interface AccordionControlBProps extends AccordionControlProps {
  editable: boolean;
  deletable: boolean;
  departmentID: number;
}

export function DepartmentViewComponent() {
  const API = useSelector((state: RootState) => state.constantSlice.api);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [CEO, setCEO] = useState<Department>();
  const [opened, setOpened] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<number>(-1);
  const [currentMode, setCurrentMode] = useState<"new" | "update">("new");
  const [Loading, setLoading] = useState<boolean>(false);

  function AccordionControl(props: AccordionControlBProps) {
    return (
      <Box className={"mr-2"} sx={{ display: "flex", alignItems: "center" }}>
        <Accordion.Control {...props} />
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon size="lg">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            {props.editable && (
                <Menu.Item
                    icon={<IconEdit />}
                    color={"blue"}
                    onClick={() => {
                      setCurrentMode("update");
                      setCurrentSelection(props.departmentID);
                      setOpened(true);
                    }}
                >
                  Edit
                </Menu.Item>
            )}
            <Menu.Item
                icon={<IconPlus />}
                color={"blue"}
                onClick={() => {
                  setCurrentMode("new");
                  setCurrentSelection(props.departmentID);
                  setOpened(true);
                }}
            >
              Add Department
            </Menu.Item>

            {props.deletable && props.editable && (
                <>
                  <Menu.Divider />
                  <Menu.Label>Danger zone</Menu.Label>
                  <Menu.Item
                      color="red"
                      icon={<IconTrash size={14} />}
                      onClick={() => {
                        deleteDepartment(props.departmentID);
                      }}
                  >
                    Delete
                  </Menu.Item>
                </>
            )}
          </Menu.Dropdown>
        </Menu>
      </Box>
    );
  }

  function accord(department: Department) {
    if (department.Department.length > 0) {
      return (
        <Accordion
          variant="separated"
          chevronPosition="left"
          className={"my-3"}
        >
          <Accordion.Item
            key={department.id}
            value={department["name"].split(" ").join("-").toLowerCase().trim()}
          >
            <AccordionControl
              editable={!department.ceo}
              deletable={false}
              departmentID={department.id}
            >
              {department["name"]}
            </AccordionControl>
            <Accordion.Panel>
              <>
                <Text className={"mb-5"}>
                  Description: {department["description"]}
                </Text>
                <Text className={"mb-5 text-sm"}>Sub Departments:</Text>
                {department.Department.map((item: Department) => {
                  return accord(item);
                })}
              </>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
    } else {
      return (
        <Accordion
          variant="separated"
          chevronPosition="left"
          className={"my-3"}
        >
          <Accordion.Item
            value={department["name"].split(" ").join("-").toLowerCase().trim()}
          >
            <AccordionControl
              editable={!department.ceo}
              departmentID={department.id}
              deletable={true}
            >
              {department["name"]}
            </AccordionControl>
            <Accordion.Panel>
              Description: {department["description"]}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      );
    }
  }

  function parseDepartments(department: Department | undefined) {
    if (department) {
      department.Department = [];
      let filter = departments.filter(
        (item) => item.DepartmentId === department.id
      );
      if (filter.length > 0) {
        {
          filter.map((item: Department) => {
            department.Department?.push(item);
            parseDepartments(item);
          });
        }
      }
      return department;
    }
    return {
      id: 0,
      ceo: false,
      Department: [],
      DepartmentId: -1,
      name: "List Empty",
      description: "List Empty",
    };
  }

  function deleteDepartment(id: number) {
    axios({
      method: "delete",
      url: API + "/departments/" + id,
    })
      .then((response) => {
        showNotification({
          title: "Success",
          message: response.data.message,
          color: "teal",
          icon: <IconCheck />,
        });
        LoadDepartments();
      })
      .catch((e) => {
        if (e.response) {
          let data = e.response.data;
          showNotification({
            title: data.message,
            message: data.data ? data.data.join("\n") : "",
            color: "red",
            icon: <IconX />,
          });
        } else {
          showNotification({
            title: "Error",
            message: "Unable fetch department list",
            color: "red",
            icon: <IconX />,
          });
        }
      });
  }

  function LoadDepartments() {
    setLoading(true);
    axios({
      method: "get",
      url: API + "/departments",
    })
      .then((response) => {
        let data = response["data"]["data"];
        let filter = data.filter((item: Department) => item.ceo);
        let ceo: Department = filter.length > 0 ? filter[0] : undefined;
        setCEO(ceo);
        setDepartments(data);
        parseDepartments(CEO);
        setLoading(false);
      })
      .catch((e) => {
        if (e.response) {
          let data = e.response.data;
          showNotification({
            title: data.message,
            message: data.data ? data.data.join("\n") : "",
            color: "red",
            icon: <IconX />,
          });
        } else {
          showNotification({
            title: "Error",
            message: "Unable to fetch department list",
            color: "red",
            icon: <IconX />,
          });
        }
        setLoading(false);
      });
  }

  function resetModal() {
    setOpened(false);
    setCurrentMode("new");
    setCurrentSelection(-1);
    LoadDepartments();
  }

  useEffect(() => {
    LoadDepartments();
  }, [setDepartments]);

  return (
    <>
      <LoadingOverlay visible={Loading} overlayBlur={1} />
      <>
        <Modal centered opened={opened} onClose={() => setOpened(false)}>
          <DepartmentFormComponent
            mode={currentMode}
            id={currentSelection}
            callback={resetModal}
          />
        </Modal>
        <Group position="right">
          <Button
            leftIcon={<IconPlus size={24} />}
            onClick={() => {
              setCurrentMode("new");
              setOpened(true);
            }}
          >
            Create
          </Button>
          <Button
            leftIcon={<IconRefresh size={24} />}
            color={"teal"}
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                LoadDepartments();
              }, 1000);
            }}
          >
            Refresh
          </Button>
        </Group>

        {CEO ? (
          accord(parseDepartments(CEO))
        ) : (
          <Center style={{ width: 400, height: 200 }} className={"m-auto"}>
            <Stack align="center" spacing="xl">
              <div className={"text-3xl"}>List Empty</div>
            </Stack>
          </Center>
        )}
      </>
    </>
  );
}
