import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { Pivot, PivotItem, PrimaryButton, TextField } from '@fluentui/react';
import { useGlobalStore } from '../../store';
import { IAccessMethod } from '../../interfaces';
import PhoneAuth from './access/phoneAuth';
import EmailAuth from './access/emailAuth';
import PasswordLogin from './access/passwordLogin';

const AccountDiv = styled.div`
    > div {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        .label {
            font-weight: 600;
            font-size: 14px;
            color: rgb(50, 49, 48);
            font-family: 'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue',
                sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .account {
            display: flex;
            flex-direction: column;
            width: 100%;
            > .label {
                margin-bottom: 1em;
            }
            > button {
                width: max-content;
            }
        }
        .phone {
            width: 100%;
        }
        .email {
            width: 100%;
        }
    }
`;

const PIVOT_LIST = [
    {
        headerText: 'phoneCert',
        itemKey: IAccessMethod.PHONE,
        element: (onSuccessLogin: () => void) => <PhoneAuth onSuccessLogin={onSuccessLogin} />,
    },
    {
        headerText: 'emailCert',
        itemKey: IAccessMethod.EMAIL,
        element: (onSuccessLogin: () => void) => <EmailAuth onSuccessLogin={onSuccessLogin} />,
    },
    {
        headerText: 'passwordLog',
        itemKey: IAccessMethod.PASSWORD,
        element: (onSuccessLogin: () => void) => <PasswordLogin onSuccessLogin={onSuccessLogin} />,
    },
];

export const LoginPanel = observer<{ onSuccessLogin?: () => void }>(function LoginPanel ({ onSuccessLogin }) {
    const { userStore } = useGlobalStore();

    return (
        <Pivot>
            {PIVOT_LIST.map((item) => (
                <PivotItem key={item.itemKey} headerText={intl.get(`login.${item.headerText}`)}>
                    {item.element(() => {
                        onSuccessLogin?.();
                        userStore.getPersonalInfo();
                    })}
                </PivotItem>
            ))}
        </Pivot>
    );
});

function Account() {
    const [isLoginStatus, setIsLoginStatus] = useState<boolean>(false);
    // const [globalSwitch, setGlobalSwitch] = useState(true);
    const { userStore } = useGlobalStore();
    const { userName, info } = userStore;
    // const pivots = PIVOT_LIST.map((p) => ({
    //     // ...p,
    //     key: p.itemKey,
    //     name: t(`access.${p.itemKey}.title`),
    // }));

    return (
        <AccountDiv>
            {isLoginStatus ? (
                <div>
                    <div className="mb-4">
                        <LoginPanel onSuccessLogin={() => setIsLoginStatus(false)} />
                    </div>
                </div>
            ) : (
                <div>
                    <div className="account">
                        <span>
                            {userName ? (
                                <PrimaryButton
                                    className="ml-2"
                                    onClick={() => {
                                        userStore.commitLogout();
                                    }}
                                >
                                    {intl.get('login.signOut')}
                                </PrimaryButton>
                            ) : (
                                <PrimaryButton onClick={() => [setIsLoginStatus(true)]}>{intl.get('login.signIn')}</PrimaryButton>
                            )}
                        </span>
                        {userName && <TextField value={userName || ''} disabled={true} />}
                    </div>
                    {info && (
                        <div className="phone">
                            <TextField label="Phone" value={info.phone} disabled={true} />
                        </div>
                    )}
                    {info && (
                        <div className="email">
                            <TextField label="Email" value={info.email} disabled={true} />
                        </div>
                    )}
                </div>
            )}
        </AccountDiv>
    );
}

export default observer(Account);
