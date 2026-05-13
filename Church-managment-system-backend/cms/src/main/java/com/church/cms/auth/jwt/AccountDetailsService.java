package com.church.cms.auth.jwt;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.church.cms.auth.Account;
import com.church.cms.auth.AccountPrincipal;
import com.church.cms.auth.AccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountDetailsService implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Account account = accountRepository
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found"));

        return new AccountPrincipal(account);
    }
}
